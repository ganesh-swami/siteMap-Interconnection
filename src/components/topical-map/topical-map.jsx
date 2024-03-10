import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
// @mui
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { MarkerType } from 'reactflow';
// import dagre from 'dagre';

import FlowChart from './flow-chart';
import 'reactflow/dist/style.css';

const position = { x: 0, y: 0 };
const defaultEdgeType = MarkerType.ArrowClosed;
const EDGE_COLOR='#6A5AE0';
const TopicalMap = ({ topicaldata }) => {
  const [initialNodes, setInitialNodes] = useState([]);
  const [initialEdges, setInitialEdges] = useState([]);
  const [needToAddEdges, setNeedToAddEdges] = useState([]);
  const [leve2TotalNode, setLeve2TotalNode] = useState(0);
  const [leve3TotalNode, setLeve3TotalNode] = useState(0);
  // const [layoutedEdges, setLayoutedEdges] = useState();
  // const [layoutedNodes, setLayoutedNodes] = useState();

  const allLinks = new Map(); // = Nodes
  const leve2LinksToIndex= new Map();
  const connections = [];
  const nodeIdToLevelMap = new Map();
  const nodes = [];
  const edges = [];
  const remainingEdges = [];
  // const dagreGraph = new dagre.graphlib.Graph();
  // const nodeWidth = 350;
  // const nodeHeight = 70;
  
  // let maximumNumberOfNodesInALevel = 0;

  useEffect(() => {
    let leve2TotalNodeCount = 0;
    let leve3TotalNodeCount = 0;
    topicaldata.forEach((dataa, index) => {
      if (index === 0) {
        topicaldata[0].level = 1;
      } else if (topicaldata[0].links.indexOf(dataa.url)>-1) {
        topicaldata[index].level = 2;
        leve2LinksToIndex.set(dataa.url,index);
        // leve2TotalNodeCount += 1;
      } else {
        topicaldata[index].level = 3;
        // leve3TotalNodeCount += 1;
      }
    });

    const startingBLogLinkIndex= getStartingBlogLinkIndex();

    // now try to adjust the links in first element so nodes created from left to right have minimum distance
    const level2Link=[]
    level2Link.push(topicaldata[startingBLogLinkIndex].url);

    let nextBlogPage=topicaldata[startingBLogLinkIndex]
    const pendingBlogToProccess=[]
    const processedBlogLInks=[]

    while (nextBlogPage) {
      const nextBlogPageUrl=nextBlogPage.url;
      const isItLastElement = addItemTOLevel2Link(level2Link,nextBlogPageUrl,nextBlogPageUrl)
      
      nextBlogPage.links.forEach((link)=>{
        if(leve2LinksToIndex.get(link)){
          const isItNewlyAdded = addItemTOLevel2Link(level2Link,nextBlogPageUrl,link,isItLastElement)
          if(isItNewlyAdded){
            pendingBlogToProccess.push(link);
          }
        }
      })
      processedBlogLInks.push(nextBlogPageUrl)
      let nextBlogPageLink = pendingBlogToProccess.shift()
      // in case if pendingBlogToProccess is empty and we still have some blog pages to process
      if(!nextBlogPageLink){
        // loop through it to find out the remaining
        leve2LinksToIndex.forEach((index, blogPageLink) => {
          if(processedBlogLInks.indexOf(blogPageLink)===-1){
            
              nextBlogPageLink=blogPageLink
            
          }
        })
      }
        nextBlogPage=topicaldata[leve2LinksToIndex.get(nextBlogPageLink)]
    }


    topicaldata[0].links=level2Link;

    

    // to calculate positioning
    // maximumNumberOfNodesInALevel =
    //   leve3TotalNodeCount > leve2TotalNodeCount ? leve3TotalNodeCount : leve2TotalNodeCount;

    // console.log("leve2TotalNodeCount >>>>>>>>>>>>>>>> ", leve2TotalNodeCount );
    // console.log("leve3TotalNodeCount >>>>>>>>>>>>>>>> ", leve3TotalNodeCount );

    topicaldata.forEach((bloglinks, index) => {
      const URI = new URL(bloglinks.url);
      const slashString=URI.pathname[URI.pathname.length-1]==='/' ? '' :'/';
      const bloglinksURL= URI.origin+URI.pathname+slashString+URI.search;
      if (!allLinks.has(bloglinksURL)) {
        const nodeId = `10${index}A`;
        const label = bloglinks.title ? bloglinks.title : new URL(bloglinksURL).pathname;
        const serpData ={
          organic_traffic:bloglinks?.organic_traffic,
          keyword:bloglinks?.keyword,
          search_position:bloglinks?.position,
          backLink:bloglinks?.backLink,
          volume:bloglinks?.volume,
          difficulty:bloglinks?.difficulty,
        }
        nodes.push({
          id: nodeId,
          data: { 
            label, 
            url: bloglinksURL, 
            level: bloglinks.level,
            ...serpData
          },
          position,
          type: 'MultiSrcAndTargetNode',
          ...serpData
          // sourcePosition: null,
          // targetPosition: Position.Right,
        });
        allLinks.set(bloglinksURL, `${10}${index}A`);
        nodeIdToLevelMap.set(nodeId, bloglinks.level);
        if(bloglinks.level===2){
          leve2TotalNodeCount += 1;
        }
        else if(bloglinks.level===3){
          leve3TotalNodeCount += 1;
        }
      }
      else{
        // update the title/label for level 2 items

        const blogLinkId = allLinks.get(bloglinksURL)
        const nodeIndex = nodes.findIndex((node) => node.id === blogLinkId);
        if(nodeIndex>-1){
          const label = bloglinks.title ? bloglinks.title : new URL(bloglinksURL).pathname;
          nodes[nodeIndex].data.label =label;
        }
      }

      // run for inner links of blog post
      bloglinks.links.forEach((link, i) => {
        const linkURI = new URL(link);
        const linkSlashString=linkURI.pathname[linkURI.pathname.length-1]==='/' ? '' :'/';
        const linkBlogURL= linkURI.origin+linkURI.pathname+linkSlashString+linkURI.search;
        const sourceNodeId = allLinks.get(bloglinksURL);

        const sourceNodeLevel = nodeIdToLevelMap.get(sourceNodeId);
        if (allLinks.has(linkBlogURL)) {
          // node already exist
          const targetNodeId = allLinks.get(linkBlogURL); // getByValue(allLinks, link);
          const targetNodeLevel = nodeIdToLevelMap.get(targetNodeId);
          // console.log(
          // 	"sourceNodeLevel === targetNodeLevel ",
          // 	sourceNodeLevel === targetNodeLevel
          // );
          //
          if (false && sourceNodeLevel === targetNodeLevel) {
            console.log('here....');
            const sourceNodeIndex = nodes.findIndex((node) => node.id === sourceNodeId);
            console.log('here.... sourceNodeIndex', sourceNodeIndex);
            if (sourceNodeIndex > -1) {
              // update the source nodeIndex type for topLeftTargetNode
              console.log('here....2222 nodes[i]', nodes[i]);
              nodes[i] = {
                ...nodes[i],
                type: 'TopLeftTargetNode',
              };
              console.log('here.... nodes[i]', nodes[i]);
            }
          }
          // createEdges(targetNodeId, sourceNodeId, sourceNodeLevel, targetNodeLevel);
          remainingEdges.push({
            targetNodeId,
            sourceNodeId,
            sourceNodeLevel,
            targetNodeLevel,
          });
        } else {
          // add to node list
          // if(bloglinks.level + 1 ===3){
          //   debugger;
          // }
          const targetNodeId = `10${index}${i}A`;
          const targetNodeLevel = nodeIdToLevelMap.get(targetNodeId);
          // findout this link in topical data for extracting SERP data
          let serpData={}
          for(let j=0;j<topicaldata.length;j+=1){
            if(topicaldata[j].url===link){
              serpData=topicaldata[j]
              serpData={
                organic_traffic:topicaldata[j]?.organic_traffic,
                keyword:topicaldata[j]?.keyword,
                search_position:topicaldata[j]?.position,
                backLink:topicaldata[j]?.backLink,
                volume:topicaldata[j]?.volume,
                difficulty:topicaldata[j]?.difficulty,
              }
              break;
            }
          }
          nodes.push({
            id: targetNodeId,
            data: { label: new URL(link).pathname,
              url: link, 
              level: bloglinks.level + 1, 
              ...serpData,
            },
            position,
            // position: { x: i * 150, y: bloglinks.level * 150 },
            type: 'MultiSrcAndTargetNode',
            ...serpData,
            // sourceNodeLevel + 1 === targetNodeLevel
            // 	? "TopTargetNode"
            // 	: "TopRightTargetNode",
            // sourcePosition: null,
            // targetPosition: null,
          });
          // add to set
          allLinks.set(linkBlogURL, targetNodeId);
          nodeIdToLevelMap.set(targetNodeId, bloglinks.level + 1);

          if(bloglinks.level + 1===2){
            leve2TotalNodeCount += 1;
          }
          else if(bloglinks.level + 1===3){
            leve3TotalNodeCount += 1;
          }

          createEdges(targetNodeId, sourceNodeId, sourceNodeLevel, targetNodeLevel);
        }
      });
    });

    setLeve2TotalNode(leve2TotalNodeCount);
    setLeve3TotalNode(leve3TotalNodeCount);
    
    // console.log('nodes...............', nodes);
    setInitialNodes(nodes);
    setInitialEdges(edges);
    setNeedToAddEdges(remainingEdges);
  }, [topicaldata]);


  const addItemTOLevel2Link=(level2Link,blogLink,link,isLinkedItemLastElement=true)=>{
    const indexOfLink = level2Link.indexOf(link)
    if(indexOfLink===-1){
  
      // check if 
      if(isLinkedItemLastElement) {
        level2Link.push(link);	
      }
      else{
        // check if upcomming element can be placed just after the blog link 
        // Note We render left to right and left elements are already in level2Link
        // if this link doesn't have any other connection from right means if all the connection is already in level2link
        const linkIndex = leve2LinksToIndex.get(link);
        const bloglinks = topicaldata[linkIndex].links;
        let canPutNearToBlogLink=true;
        bloglinks?.forEach((url)=>{
          // check if it is level 2 link 
          if(leve2LinksToIndex.get(url)){
            
            // if links inside this blog already exist in level2link it means it is in left side, if doesn't then we can't put it very close 
            // because this url will go to right side in somewhere 
            if(level2Link.indexOf(url)===-1){
              canPutNearToBlogLink=false;
            }
            
          }
        })
  
        
  
        if(canPutNearToBlogLink){
          // 
          const blogLinkIndex = level2Link.indexOf(blogLink)
          level2Link.splice(blogLinkIndex+1,0,link)
        }
  
  
  
  
      }
      return true
    }
    if(indexOfLink === level2Link.length -1){
      return true
    }
    return false;
  }

  const getStartingBlogLinkIndex =()=>{
    let startingBLogLinkIndex=1;
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i < topicaldata.length; i++) {
      const blogLink = topicaldata[i].url;
      // const blogIndex= leve2LinksToIndex.get(blogLink);
      let level2LinkCountInBlogPage=0;
      topicaldata[i].links.forEach((link)=>{
        if(leve2LinksToIndex.get(link)){
          level2LinkCountInBlogPage+=1;
        }
      })

      if(level2LinkCountInBlogPage===1){
        startingBLogLinkIndex=i;
        break;
      }
    }
    return startingBLogLinkIndex;
  }

  // useEffect(() => {
  //   if (initialNodes && initialNodes.length > 0) {
  //     dagreGraph.setDefaultEdgeLabel(() => ({}));

  //     const temp = getLayoutedElements(initialNodes, initialEdges);
  //     setLayoutedEdges(temp.Edges);
  //     setLayoutedNodes(temp.Nodes);
  //   }
  // }, [initialNodes]);

  // const getLayoutedElements = (Nodes, Edges, direction = 'TB') => {
  //   dagreGraph.setGraph({ rankdir: direction });

  //   Nodes.forEach((node) => {
  //     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  //   });

  //   Edges.forEach((edge) => {
  //     dagreGraph.setEdge(edge.source, edge.target);
  //   });

  //   // console.log('@@ pppppppppppp ', dagreGraph.node('1003A'));

  //   dagre.layout(dagreGraph);

  //   Nodes.forEach((node, index) => {
  //     // console.log("node .... ", node);
  //     const nodeWithPosition = dagreGraph.node(node.id);
  //     // console.log('node.id , nodeWithPosition', node.id, nodeWithPosition);
  //     // just to put nodes little up and down so edges can be seen easily if multiple adges are going from same path
  //     const deviation = index % 2 ? (index % 5) * 5 : 0;
  //     // We are shifting the dagre node position (anchor=center center) to the top left
  //     // so it matches the React Flow node anchor point (top left).
  //     node.position = {
  //       x: nodeWithPosition.x + nodeWidth / 2,
  //       y: nodeWithPosition.y - nodeHeight / 2 + deviation, // node.position.y, //
  //     };

  //     return node;
  //   });

  //   // console.log('@@ pppppppppppp ======== ', dagreGraph.node('1001A'));

  //   return { Nodes, Edges };
  // };

  /* 
create connection according to these conditions 
conditions :
- If once way connection already exist
- If connection from supprting article to main article
- If connection in siblings 
*/

  const createEdges = (targetNodeId, sourceNodeId, sourceNodeLevel, targetNodeLevel) => {
    // console.log('targetNodeId', targetNodeId, sourceNodeId);
    const mainNodeId = '100A'; // '10' + index (index is 0 for first)

    if (false && targetNodeLevel === sourceNodeLevel) {
      // means siblings so create connection accordingly
      edges.push({
        id: `${sourceNodeId}_${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: 'l',
        targetHandle: 'r',
        type: 'step',
        markerEnd: {
          type: MarkerType.Arrow,
          color: '#00aa41',
        },
        style: {
          strokeWidth: 2,
          stroke: '#00aa41',
        },
      });
    } else if (false && connections.includes(`${targetNodeId}_${sourceNodeId}`)) {
      // now it is never going to reach here
      let alreadyExistEdgeId = null;
      edges.find((edge, index) => {
        console.log('check .... ', edge.id, `${targetNodeId}${index}`);
        if (edge.id === `${targetNodeId}_${sourceNodeId}`) {
          alreadyExistEdgeId = index;
          return true;
        }
        return false;
      });
      console.log('alreadyExistEdgeId', alreadyExistEdgeId);

      if (alreadyExistEdgeId >= 0) {
        edges[alreadyExistEdgeId] = {
          ...edges[alreadyExistEdgeId],
          idNew: `${sourceNodeId}_${targetNodeId}`,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6A5AE0',
          },
          markerStart: {
            type: MarkerType.ArrowClosed,
            orient: 'auto-start-reverse',
            color: '#6A5AE0',
          },
          style: {
            strokeWidth: 2,
            stroke: '#6A5AE0',
          },
        };

        // if (targetNodeLevel === sourceNodeLevel) {
        // 	// siblings
        // 	edges[alreadyExistEdgeId]["sourceHandle"] = "l";
        // 	edges[alreadyExistEdgeId]["targetHandle"] = "r";
        // }
      }
    } else if (false && mainNodeId === targetNodeId) {
      // linking to main node / or back to main node also they both have different level

      edges.push({
        id: `${sourceNodeId}_${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        // targetNodeId,
        // sourceHandle: "l",
        // targetHandle: "r",
        // type: "smoothstep",
        markerEnd: {
          type: MarkerType.Arrow,
          color: '#ffc107',
          orient: 10,
        },
        style: {
          strokeWidth: 2,
          stroke: '#ffc107',
        },
      });
    } else {
      edges.push({
        id: `${sourceNodeId}_${targetNodeId}`,
        source: sourceNodeId,
        target: targetNodeId,
        sourceHandle: 'b',
        targetHandle: 't',
        markerEnd: {
          type: defaultEdgeType,
        },
        color:EDGE_COLOR
        // animated: true,
      });
    }
    connections.push(`${sourceNodeId}_${targetNodeId}`);
  };
  
  return (
    // <Box>
    <Box>
      {/* <Typography variant="h3" component="h3">
        Topical MAP
      </Typography> */}
      {initialNodes && initialEdges && initialNodes.length > 0 && ( 
        <FlowChart
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          needToAddEdges={needToAddEdges}
          leve2TotalNodeCount={leve2TotalNode}
          leve3TotalNodeCount={leve3TotalNode}
          // layoutedNodes={layoutedNodes}
          // layoutedEdges={layoutedEdges}
          // dagreGraph={dagreGraph}
          // ppp ={dagreGraph.node('1003A')}
          topicaldata={topicaldata}
        />
       )}
    </Box>
    // </Box>
  );
};

TopicalMap.propTypes = {
  topicaldata: PropTypes.array,
  // sx: PropTypes.node,
};

export default memo(TopicalMap);
