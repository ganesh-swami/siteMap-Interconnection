'use client';


import React,{ useEffect,useState } from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
// hooks
// import { useMockedUser } from 'src/hooks/use-mocked-user';
// routes
import { paths } from 'src/routes/paths';
// locales
// components
import Label from 'src/components/label';

import { useUserContext } from 'src/context/user/use-user-context';

const STARTER='Starter';
const GROWTH='Growth';
const EXPAND='Expand';
const STARTER_PLAN_ID='6537e7f5889526be2ff24159';
const GROWTH_PLAN_ID='6537e83e889526be2ff24161';
const EXPAND_PLAN_ID='6537e832889526be2ff2415f';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  const { currentUser,getUser,userPlan } = useUserContext();
  const [upgradeText,setUpgradeText]=useState(STARTER);
  const [upgradePlanId,setUpgradePlanId]=useState(STARTER_PLAN_ID);
  const [planBadge,setPlanBadge]=useState('Free');

   useEffect(()=>{
    getUser();
  },[]);

  useEffect(()=>{
    if(userPlan){
      console.log('userPlan',userPlan.name);
      switch (userPlan.name) {
        case STARTER:
          setPlanBadge(STARTER);
          setUpgradeText(GROWTH);
          setUpgradePlanId(GROWTH_PLAN_ID);
          break;
        case GROWTH:
          console.log('userPlan... ',)
          setPlanBadge(GROWTH);
          setUpgradeText(EXPAND);
          setUpgradePlanId(EXPAND_PLAN_ID);
          break;
        case EXPAND:
          setPlanBadge(EXPAND);
          setUpgradeText(null);
          setUpgradePlanId(null);
          break;
        default:
          break;
      }

      if(userPlan.subscriptionStatus==='trialing'){
        setPlanBadge('Trial');
      }
    }
  },[userPlan])



  console.log('user ---- ',currentUser);

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
      }}
    >
      <Stack alignItems="center">
        { currentUser ?
        <>
        <Box sx={{ position: 'relative' }}>
          {/* <Avatar src={user?.photoURL} alt={user?.name} sx={{ width: 48, height: 48 }} /> */}
          <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            {planBadge}
          </Label>
        </Box>

        <Stack spacing={0.5} sx={{ mt: 1.5, mb: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {currentUser?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {currentUser?.email}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            Credit Left : {currentUser.credit ? currentUser.credit  : 0}
          </Typography>
        </Stack>

        {upgradeText && <Button variant="contained" href={`${paths.payment.checkout}${upgradePlanId}/`}>
          { currentUser.trialUsed ? `Upgrade to ${upgradeText}` : 'Try Free' }
        </Button>
        }
        </>
        : <CircularProgress />
      }
      </Stack>
      
    </Stack>
  );
}
