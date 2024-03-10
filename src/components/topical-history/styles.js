import { alpha, styled } from '@mui/material/styles';
import {Typography,Box,Link} from '@mui/material'

const TopicalHistoryBox = styled(Box)(({ theme, themeStretch}) => ({
    margin:'40px 0'
}))

const TopicalHistoryTypography = styled(Typography)(({theme})=>({
    color:theme.palette.grey[80],
    fontSize:'0.875rem',
    fontWeight:600,
    lineHeight:'1.25rem'
}))

const TopicalMapBox=styled(Box)(({theme})=>({
    margin:'2rem auto'
}))


const TopicalItem = styled(Link)(({ theme }) => ({
    color: theme.palette.text.secondary,
    border:`1px solid ${theme.palette.grey[10]}`,
    borderRadius:'0.5rem',
    padding:'2rem',
    cursor:'pointer',
    transition: 'opacity 0.2s ease-in-out 0s',
    minHeight:'108px',
    '.favicon:before':{
        content: `' '`,
        display: 'block',
        position: 'absolute',
        height: '1.5rem',
        width: '1.5rem',
        backgroundImage: `url('https://google.com/favicon.ico')`,
        backgroundColor:'#fff'
    },
    '&:hover':{
        // boxShadow:`1px 1px 7px 1px ${theme.palette.grey[10]}`,
        boxShadow:'0px 1px 2px rgba(24,26,34,0.08),0px 4px 16px rgba(24,26,34,0.04)',
    },
    '&:hover .tpTime':{
        display:'flex'
    }

}));

export default {
    TopicalHistoryBox,
    TopicalHistoryTypography,
    TopicalMapBox,
    TopicalItem
}