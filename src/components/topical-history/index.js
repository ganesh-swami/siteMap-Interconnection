import React, { useEffect, useState } from 'react'

import { Box,Typography,Stack, Link } from "@mui/material";
import { useTopicalContext } from 'src/context/topical/use-topical-context';
import Styles from './styles'

function TopicalHistory(props) {
  const {  
    topicalMaps,
    topicalMapsPage,
    getTopicalHistory
  } = useTopicalContext();

    const [topicalMapsToShow,setTopicalMapsToShow]=useState([]);
    const [page,setPage]=useState(1);
    const [shownext,setShowNext]=useState(false);
    const [showprev,setShowPrev]=useState(false);

    useEffect(() => {
        getTopicalHistory();
    }, []);
    
    useEffect(()=>{
        // console.log('++++ topicalMaps',topicalMaps)
        if(topicalMaps && topicalMaps.length>0){
            // if(page*10>=topicalMaps.length){

            // }
            
            const filteredTopicalMap = topicalMaps.filter((topicalMap,index) =>(index+1) <= page*20)

            // console.log('++++ filteredTopicalMap',filteredTopicalMap);

            setTopicalMapsToShow(filteredTopicalMap);

        }
    },[topicalMaps,topicalMaps.length]) // without length it doesn't detact change in topicalmaps


    useEffect(()=>{
        
        if(topicalMaps && topicalMaps.length>0 && page){
            if(topicalMaps.length>=page*20){
                const filteredTopicalMap = topicalMaps.filter((topicalMap,index) =>(index+1) <= page*20)
                setTopicalMapsToShow(filteredTopicalMap);
            }
            else{
                // call for next page data

            }
        }

    },[page])

  return (
    <Styles.TopicalHistoryBox>
        <Styles.TopicalHistoryTypography variant='p'>
        Recent
        </Styles.TopicalHistoryTypography>
        <Styles.TopicalMapBox>
            <Stack spacing={2}>
                {topicalMapsToShow && topicalMapsToShow.length>0 &&
                    topicalMapsToShow.map((topicalmap)=>{
                        const createdAt = new Date(topicalmap?.createdAt);
                        const dateTime= `${createdAt.toDateString()} ${createdAt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`;
                        return (
                            <Styles.TopicalItem key={topicalmap?._id} href={`topical/${topicalmap?._id}/`} underline="none">
                                <Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography  sx={{
                                            color:(theme)=>theme.palette.grey[120],
                                            fontWeight:600,
                                        }}><img alt={`${topicalmap?.title}`} className='favicon' style={{
                                            width:'1.5rem',
                                            height:'1.5rem',
                                            marginRight:'0.5rem'
                                        }} src={`${topicalmap.origin}/favicon.ico`} />{topicalmap?.title}</Typography>
                                        <Typography className='tpTime' size='sm' sx={{
                                            fontSize:'0.8125rem',
                                            color:(theme)=>theme.palette.grey[80],
                                            display:'none'
                                        }}>{dateTime}</Typography>
                                    </Stack>
                                    <Typography variant='body1' sx={{
                                        color:(theme)=>theme.palette.grey[80],
                                    }} underline="none">{topicalmap?.url}</Typography>
                                    {/* href={`${topicalmap?.url}`} */}
                                </Stack>
                                
                            </Styles.TopicalItem>
                        )
                    })
                }
                
                {/* <Styles.TopicalItem href="#" underline="none">Item 2</Styles.TopicalItem>
                <Styles.TopicalItem href="#" underline="none">Item 3</Styles.TopicalItem> */}
            </Stack>
        </Styles.TopicalMapBox>
    </Styles.TopicalHistoryBox>
  )
}

export default TopicalHistory;