import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import GroupIcon from '@mui/icons-material/Group';

const CircleIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: 'auto',
  minWidth: '80px',
  minHeight: '80px',
  borderRadius: '50%',
  backgroundColor: '#87432dd8',
});

interface UsersTotalProps {
  total: number;
}


export const UsersTotal = ({total}:UsersTotalProps) => {
  return (
    <Grid  sx={{ border: '1px ', borderRadius: '25px', padding: '25px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.658)' }} >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircleIcon>
          <GroupIcon color="action" sx={{ fontSize: 40 }} />
        </CircleIcon>
        <Typography sx={{marginLeft: '15px', fontSize: 33 }}>{total} Usuários cadastrados</Typography>
      </Box>
    </Grid>
  )
}
