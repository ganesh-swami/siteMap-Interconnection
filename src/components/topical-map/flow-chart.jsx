import PropTypes from 'prop-types';
import { useState, useEffect, useCallback, memo, useRef } from 'react'; // forwardRef

import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType,
  Controls,
  Background,
  ControlButton
} from 'reactflow';
import { Box } from '@mui/material'; // CircularProgress
import dagre from 'dagre';
// import { toPng } from 'html-to-image';
import { usePDF } from 'react-to-pdf';
import CustomNodes from './custom-nodes';
import DownloadButton from './download-button';
import 'reactflow/dist/style.css';

const EDGE_COLOR='#6A5AE0';
const { TopTargetNode, TopRightTargetNode, TopLeftTargetNode, DefaultNode,MultiSrcAndTargetNode } = CustomNodes;
const nodeTypes = {
  TopTargetNode,
  TopRightTargetNode,
  TopLeftTargetNode,
  DefaultNode,
  MultiSrcAndTargetNode
};
// const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 150;


const getLayoutedElements = (Nodes, Edges, leve2TotalNodeCount,leve3TotalNodeCount) => {
  // console.log('leve2TotalNodeCount ',leve2TotalNodeCount);
  dagreGraph.setGraph({ rankdir: 'TB' });

  Nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  Edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // console.log('@@ pppppppppppp ', dagreGraph.node('1003A'));

  dagre.layout(dagreGraph);
  let decreaseXPosition=20; // just starting
  let deviationMultiplier=5;
  if(leve2TotalNodeCount>6){
    deviationMultiplier=10;
  }
  let level2Index=0;
  let level3Index=0;
  let leve2MinX=99999;
  let leve2MaxX=-1;

  Nodes.forEach((node, index) => {
    
    const nodeWithPosition = dagreGraph.node(node.id);
    let nodePostionY=0;
    let nodePostionX=0
    // debugger;
    if(node?.data?.level===2){
      // just to put nodes little up and down so edges can be seen easily if multiple adges are going from same path
      const deviation = (level2Index % 3) * deviationMultiplier;
      // now try to decrease the distance of nodes
      if(leve2TotalNodeCount>6 && deviation>0){
        // out of 3 , 2 will not be in same line so decrease it accordingly
        decreaseXPosition+=20;
        
      }
      else{
        decreaseXPosition+=20; // just a number to decrease the space for every remaining case
      }
      nodePostionY=(nodeWithPosition.y - nodeHeight / 2) + deviation;
      nodePostionX = nodeWithPosition.x - decreaseXPosition;
      if(leve2MinX>nodePostionX){
        leve2MinX=nodePostionX;
      }
      if(leve2MaxX<nodePostionX){
        leve2MaxX=nodePostionX
      }
      level2Index+=1;
    }
    else if(node?.data?.level===3){
      // just to put nodes little up and down so edges can be seen easily if multiple adges are going from same path
      const deviation = (level3Index % 3) * deviationMultiplier;
      // now try to decrease the distance of nodes
      // if(leve3TotalNodeCount>6 && deviation>0){
      //   // out of 3 , 2 will not be in same line so decrease it accordingly
      //   decreaseXPosition+=200;
        
      // }
      // else{
      //   decreaseXPosition+=20; // just a number to decrease the space for every remaining case
      // }

      // center node position change 
      const mainNodeWithPosition = dagreGraph.node(Nodes[0].id);
      const changeInMainNode = mainNodeWithPosition.x - ((leve2MaxX-leve2MinX)/2 + leve2MinX)
      // debugger;
      // console.log('changeInMainNode',changeInMainNode);
      decreaseXPosition = (level3Index+1 )* (changeInMainNode/leve3TotalNodeCount);

      // debugger;

      nodePostionY=(nodeWithPosition.y - nodeHeight / 2) + deviation;
      nodePostionX = nodeWithPosition.x - Math.abs(decreaseXPosition);
      nodePostionY += (deviationMultiplier * 3);
      level3Index+=1;
    }
    // else {
    //   nodePostionX = nodeWithPosition.x + nodeWidth / 2 - ((leve2TotalNodeCount/3)-1)*nodeWidth; 
    //   nodePostionY = nodeWithPosition.y - nodeHeight / 2; 
    // }
    
    

    
    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodePostionX, // nodeWithPosition.x, // + nodeWidth / 2,
      y: nodePostionY // (nodeWithPosition.y - nodeHeight / 2) + deviation, // node.position.y, //
    };

    return node;
  });


  // update the position of mid 
  Nodes[0].position.x=(leve2MaxX-leve2MinX)/2 + leve2MinX


  return { nodes:Nodes, edges:Edges };
};

const FlowChart = ({
  initialNodes,
  initialEdges,
  needToAddEdges,
  leve2TotalNodeCount,
  leve3TotalNodeCount,
  topicaldata
}) => {

  // console.log('---- leve2TotalNodeCount',leve2TotalNodeCount);
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges, 
    leve2TotalNodeCount,
    leve3TotalNodeCount
  );

  // const flowRef = useRef();
  const { toPDF, flowRef } = usePDF({filename: 'page.pdf'});

  const [allNodes, setAllNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [allEdges, setAllEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const [nowRun, setNowRun] = useState(false);
  const [fitView,setFitView]=useState(false);



  const onConnect = useCallback(
    (params) =>
    setAllEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      setNowRun(true);
    }, 200);
  }, []);

  useEffect(() => {
    // code to run after render goes here
    if (nowRun && allNodes && allNodes.length > 0) {
      setNowRun(false);
      const mainNodeId = '100A'; // '10' + index (index is 0 for first)
      
      const tmpedges = [...allEdges];
      const tmpNodes = [...allNodes];
      needToAddEdges.forEach((edgeProps) => {
        

        let alreadyExistEdgeId = null;
        tmpedges.find((edge, index) => {
          if (edge.id === `${edgeProps.targetNodeId}_${edgeProps.sourceNodeId}`) {
            alreadyExistEdgeId = index;
            return true;
          }
          return false;
        });
        const sourceNodePosition = dagreGraph.node(edgeProps.sourceNodeId);
        const targetNodePosition = dagreGraph.node(edgeProps.targetNodeId);
        // console.log('alreadyExistEdgeId', alreadyExistEdgeId);
        // one way edge is already there now make it two way
        if ((alreadyExistEdgeId || alreadyExistEdgeId === 0) && alreadyExistEdgeId >= 0) {

          const color = EDGE_COLOR;
          // if(false && edgeProps.targetNodeLevel === edgeProps.sourceNodeLevel){
          //   const edgelength=Math.abs(sourceNodePosition.x - targetNodePosition.x);
          //   if(edgelength>750){
          //     color='#593516';
          //   }
          //   else if(edgelength<=750 && edgelength>350) {
          //     color='#08fcec';
          //   }
          // }
          
          tmpedges[alreadyExistEdgeId] = {
            ...tmpedges[alreadyExistEdgeId],
            idNew: `${edgeProps.sourceNodeId}_${edgeProps.targetNodeId}`,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color,
            },
            markerStart: {
              type: MarkerType.ArrowClosed,
              orient: 'auto-start-reverse',
              color,
            },
            style: {
              strokeWidth: 3,
              stroke: color,
            },
            color,
            zIndex:2,
          };

        } else {
          // update the nodes
          // get the source Node & target Node
          // update nodes to use require nodetypes
          const sourceNodeIndex = allNodes.findIndex((node) => node.id === edgeProps.sourceNodeId);
          const targetNodeIndex = allNodes.findIndex((node) => node.id === edgeProps.targetNodeId);
          
          // if (false && sourceNodePosition.x < targetNodePosition.x) { // #593516
          //   // it means source node is left to target node
          //   // sourceNode should have source in right, target node should have target in left like  "TopLeftTargetNode"
            
          //   // for now update only if type is default
          //   if (
          //     (sourceNodeIndex || sourceNodeIndex === 0) &&
          //     tmpNodes[sourceNodeIndex].type === 'DefaultNode'
          //   ) {
          //     tmpNodes[sourceNodeIndex] = {
          //       ...tmpNodes[sourceNodeIndex],
          //       type: 'TopLeftTargetNode',
          //     };
          //   }
          //   if (
          //     (targetNodeIndex || targetNodeIndex === 0) &&
          //     tmpNodes[targetNodeIndex].type === 'DefaultNode'
          //   ) {
          //     tmpNodes[targetNodeIndex] = {
          //       ...tmpNodes[targetNodeIndex],
          //       type: 'TopLeftTargetNode',
          //     };
          //   }
          // } else if(false) { // it means source node is right to target node
          //   if (
          //     (sourceNodeIndex || sourceNodeIndex === 0) &&
          //     tmpNodes[sourceNodeIndex].type === 'DefaultNode'
          //   ) {
          //     tmpNodes[sourceNodeIndex] = {
          //       ...tmpNodes[sourceNodeIndex],
          //       type: 'TopRightTargetNode',
          //     };
          //   }
          //   if (
          //     (targetNodeIndex || targetNodeIndex === 0) &&
          //     tmpNodes[targetNodeIndex].type === 'DefaultNode'
          //   ) {
          //     tmpNodes[targetNodeIndex] = {
          //       ...tmpNodes[targetNodeIndex],
          //       type: 'TopRightTargetNode',
          //     };
          //   }
          // }


          tmpNodes[sourceNodeIndex] = {
            ...tmpNodes[sourceNodeIndex],
            type: "MultiSrcAndTargetNode",
          };
  
          tmpNodes[targetNodeIndex] = {
            ...tmpNodes[targetNodeIndex],
            type: "MultiSrcAndTargetNode",
          };

          // console.log('tmpNodes', tmpNodes);

          // now we have the types of nodes so create the edge accordingly

          const newEdge = {
            id: `${edgeProps.sourceNodeId}_${edgeProps.targetNodeId}`,
            source: edgeProps.sourceNodeId,
            target: edgeProps.targetNodeId,
            type: ConnectionLineType.Bezier,
            sourceHandle: sourceNodePosition.x < targetNodePosition.x ? "rs" : "l",
            targetHandle:sourceNodePosition.x < targetNodePosition.x ? "lt" : "r",
            // sourceHandle: tmpNodes[sourceNodeIndex].type === 'TopRightTargetNode' ? 'l' : 'r',
            // targetHandle: tmpNodes[targetNodeIndex].type === 'TopRightTargetNode' ? 'r' : 'l',
            color:EDGE_COLOR,
            zIndex:2
          };

          // if(true){
          //   console.log('just to avoid coloring')
          // }
          // else if (mainNodeId === edgeProps.targetNodeId) {
          //   newEdge.markerEnd = {
          //     type: MarkerType.Arrow,
          //     color: '#ffc107',
          //     orient: 10,
          //   };
          //   newEdge.style = {
          //     strokeWidth: 2.2,
          //     // stroke: '#ffc107',
          //   };
          //   newEdge.type = ConnectionLineType.SmoothStep;
          // } else if (edgeProps.targetNodeLevel === edgeProps.sourceNodeLevel) {
          //   newEdge.markerEnd = {
          //     type: MarkerType.Arrow,
          //     color: '#00aa41',
          //   };
          //   newEdge.style = {
          //     strokeWidth: 1.7,
          //     stroke: '#00aa41',
          //   };
          //   newEdge.animated = true;
          //   // distance is little far then 
          //   if(Math.abs(sourceNodePosition.x - targetNodePosition.x)>300){
          //     newEdge.markerEnd.color='#593516';
          //     newEdge.style.stroke= '#593516';
          //     newEdge.animated = false;
          //   }

          // } else if (edgeProps.targetNodeLevel + 1 === edgeProps.sourceNodeLevel) {
          //   // source to target
          //   // #ffb34b

          //   newEdge.markerEnd = {
          //     type: MarkerType.Arrow,
          //     color: '#ffb34b',
          //   };
          //   newEdge.style = {
          //     strokeWidth: 1.5,
          //     stroke: '#ffb34b',
          //   };
          //   // newEdge["animated"] = true;
          // }
          // else if (edgeProps.targetNodeLevel > edgeProps.sourceNodeLevel) {
          //   // target to source
          //   // #ffb34b

          //   newEdge.markerEnd = {
          //     type: MarkerType.Arrow,
          //     color: '#2583f4',
          //   };
          //   newEdge.style = {
          //     strokeWidth: 2.3,
          //     stroke: '#2583f4',
          //   };
          //   // newEdge["animated"] = true;
          // }
          // else{
          //   newEdge.markerEnd = {
          //     type: MarkerType.Arrow,
          //     color: '#bbb',
          //   };
          //   newEdge.style = {
          //     strokeWidth: 1.5,
          //     stroke: '#bbb',
          //   };
          // }

          // console.log('new Edge == ', newEdge);
          // console.log('new [...edges, newEdge] == ', [...Edges, newEdge]);

          tmpedges.push(newEdge);
          // setEdges([...edges, newEdge]);
        }
      });
      // console.log('$$$$$$$$$$$$$$$$$ tmpNodes', tmpNodes);
      // console.log('$$$$$$$$$$$$$$$$$ allNodes', allNodes);
      // console.log('$$$$$$$$$$$$$$$$$ tmpedges', tmpedges);
      // console.log('$$$$$$$$$$$$$$$$$ allEdges', allEdges);
      // debugger;
      setAllNodes((prevNodes) => 
        // console.log("prevNodes *********************** ",prevNodes) 
         tmpNodes
      );
      setAllEdges(
        (prevEdges) => 
          // console.log("prevEdges *********************** ",prevEdges) 
           tmpedges
        
      );
      setTimeout(() => {
        setFitView(true);
      }, 1000);
      
      console.log('---------------------------------------------------tmpedges ',tmpedges);
    }
  }, [nowRun]); // needToAddEdges,
  return (
    <>
      {allNodes && allNodes.length > 0 && (
        <Box 
        height='500px'
        width="100%"
        >
        <ReactFlow
          nodes={allNodes}
          edges={allEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView={fitView}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          ref={flowRef}
        >
          <Controls />
          <DownloadButton topicaldata={topicaldata}/>
          <Background color="#ccc" variant="cross" />
        </ReactFlow>
        {/* <CircularProgress /> */}
        </Box>
      )}
    </>
  );
};
FlowChart.propTypes = {
  initialNodes: PropTypes.array,
  initialEdges: PropTypes.array,
  needToAddEdges: PropTypes.array,
  leve2TotalNodeCount:PropTypes.number,
  leve3TotalNodeCount:PropTypes.number,
  topicaldata:PropTypes.array
};

export default memo(FlowChart);
