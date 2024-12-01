import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import EventIcon from '@mui/icons-material/Event';

const CircleIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: 'auto',
  minWidth: '80px',
  minHeight: '80px',
  borderRadius: '50%',
  backgroundColor: '#f43734e6',
});

interface EventsTotalProps {
  total: number;
}


export const EventsTotal = ({total}:EventsTotalProps) => {
  return (
    <Grid  sx={{ border: '1px ', borderRadius: '25px', padding: '25px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.658)' }} >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircleIcon>
          <EventIcon color="action" sx={{ fontSize: 40 }} />
        </CircleIcon>
        <Typography sx={{ fontSize: 33, marginLeft: '15px' }}> {total}  Eventos cadastrados</Typography>
      </Box>
    </Grid>
  )
}
