import { alpha, styled } from '@mui/material/styles';
import {TextField,Box,Container} from '@mui/material'
import FormProvider, { RHFTextField } from 'src/components/hook-form';

const TopicalContainer = styled(Container)(({ theme, themeStretch}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    maxWidth: themeStretch ? false : 'xl'
}));

const TopicalInputBox = styled(RHFTextField)(({ theme }) => ({
    height:'2.5rem',
    // width: 300,
    // color: theme.palette.success.main,
    // '& .MuiSlider-thumb': {
    //   '&:hover, &.Mui-focusVisible': {
    //     boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.success.main, 0.16)}`,
    //   },
    //   '&.Mui-active': {
    //     boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.success.main, 0.16)}`,
    //   },
    // },

    

    // '& fieldset':{
    //     transition: 'outline-color 0.2s ease-in-out 0s, border-color 0.2s ease-in-out 0s',
    //     '&:focus':{
    //         borderColor:'#7934CB',
    //     }
    // },

    '& input':{
        // padding:'0.45rem 0.75rem',
        fontSize:'1rem',
        lineHeight: '1.5rem',
    }
}));

const FormWrapper = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.border}`,
    padding: '2rem',
    borderRadius: '0.5rem',
    width: '100%',

}))





export default {
    TopicalInputBox,
    FormWrapper,
    TopicalContainer
}