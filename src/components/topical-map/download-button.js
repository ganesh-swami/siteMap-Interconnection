import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import {Button,Stack} from '@mui/material'
import { Panel, useReactFlow, getRectOfNodes, getTransformForBounds } from 'reactflow';
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";

function downloadImage(dataUrl) {
  const a = document.createElement('a');

  a.setAttribute('download', 'reactflow.png');
  a.setAttribute('href', dataUrl);
  a.click();
}

function downloadPDF(dataUrl) {
    // const a = document.createElement('a');
  
    // a.setAttribute('download', 'reactflow.png');
    // a.setAttribute('href', dataUrl);
    // a.click();
    /* eslint new-cap: ["error", { "newIsCap": false }] */
    const Pdf = new jsPDF();
    Pdf.addImage(dataUrl, 'PNG', 0, 0); // 794,1123,'download2.pdf',undefined,90
    Pdf.save("download.pdf");
  }

const imageWidth = 2560;
const imageHeight = 1772;

const DownloadButton =({topicaldata}) =>{

  // useEffect(()=>{
  //   if(topicaldata){

  //   }
  // },[topicaldata])
  const { getNodes } = useReactFlow();
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    
    const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.7, 2);

    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth,
        height: imageHeight,
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };

  const onClickPDFDownload = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const pdfHeight = 1123
    const  pdfWidth= 794
    const transform = getTransformForBounds(nodesBounds, pdfWidth, pdfHeight, 0.5, 2);
    console.log('transform ---------- ',transform);
    console.log('transform',`translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`);
    toPng(document.querySelector('.react-flow__viewport'), {
      backgroundColor: '#eff',
      width: pdfWidth,
      height: pdfHeight,
      style: {
        width: pdfWidth,
        height: pdfHeight,
        // transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
        transform: `translate(400px, -10px) scale(0.5) rotate(90deg)`,
      },
    }).then(downloadPDF);
  };

  const onClickCSVDownload = () => {

    const csvHeader=[
      "label",
      "url",
      "organic traffic",
      "main keyword",
      "search position",
      "backLink details",
      "search volume",
      "keyword difficulty",
      "links",
    ]


    const csvBody = topicaldata.map((bloglinks)=>{
      const URI = new URL(bloglinks.url);
      const slashString=URI.pathname[URI.pathname.length-1]==='/' ? '' :'/';
      const bloglinksURL= URI.origin+URI.pathname+slashString+URI.search;
      let  backLinkString='';

      if(bloglinks.backLink){
        // backLinkString = bloglinks.backLink.map((backlink)=>{ 
          const backlink = bloglinks.backLink;
          backLinkString= `backlinks :${backlink.backlinks}; dofollow : ${backlink.backlinks}; referring pages:${backlink['referring pages']}; referring domains : ${backlink['referring domains']};`;
        // })
      }
      return [
        bloglinks.title ? bloglinks.title : new URL(bloglinksURL).pathname,
        bloglinks.url,
        bloglinks.organic_traffic ? bloglinks.organic_traffic : '',
        bloglinks.keyword ? bloglinks.keyword : '',
        bloglinks.position ? bloglinks.position : '',
        backLinkString,
        bloglinks.volume ? bloglinks.volume : '',
        bloglinks.difficulty ? bloglinks.difficulty : '',
        bloglinks.links.join('; '),
      ]
    })

    console.log('csvBody',csvBody);


    const csvContent = [
      csvHeader,
      ...csvBody
    ]
    // .map(e => e.join(",")) 
    .join("\n");
    
    console.log('csvContent',csvContent);

    const element = document.createElement('a');
    element.href = `data:text/csv;charset=utf-8,  ${encodeURI(csvContent)}`;
    element.target = '_blank';
    element.download = 'export.csv';
    element.click();

  };

  

  return (
    <Panel position="top-right">
        <Stack direction="row" spacing={2}>
            <Button variant="contained" color="secondary" onClick={onClick}>
                Download Image
            </Button>
            <Button variant="contained" color="secondary" onClick={onClickCSVDownload}>
                Download CSV
            </Button>
            
        </Stack>
    </Panel>
  );
}

DownloadButton.propTypes = {
  topicaldata:PropTypes.array
};

export default DownloadButton;
