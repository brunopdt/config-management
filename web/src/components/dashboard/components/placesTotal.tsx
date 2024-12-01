import { Grid, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const CircleIcon = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 'auto',
  height: 'auto',
  minWidth: '80px',
  minHeight: '80px',
  borderRadius: '50%',
  backgroundColor: '#FBD574',
});

interface PlacesTotalProps {
  total: number;
}

export const PlacesTotal = ({total}:PlacesTotalProps) => {
  return (
    <Grid  sx={{ border: '1px ', borderRadius: '25px', padding: '25px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.658)' }} >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <CircleIcon>
          <LocationOnIcon color="action" sx={{ fontSize: 40 }} />
        </CircleIcon>
        <Typography sx={{marginLeft: '15px', fontSize: 33 }}>{total} Locais cadastrados</Typography>
      </Box>
    </Grid>
  )
}
