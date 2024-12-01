import { Grid, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import DashboardPlace from "../../../models/DashboardPlace";

interface PlacesContainerProps {
  places: DashboardPlace[];
}

export const PlacesContainer = ({ places }: PlacesContainerProps) => { 

  const [placeData, setPlaceData] = useState<DashboardPlace[]>([]);

  useEffect(() => {
    setPlaceData(places);
  }, [places]);

  return (
    <Grid item xs={12} sx={{ border: '1px ', borderRadius: '25px', padding: '20px', maxWidth: '750px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.658)' }} >
      <Typography sx={{ fontSize: 30, textAlign: 'center'  }}>Locais favoritos</Typography>
      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: '20px' }}>
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: placeData.map(place => place.name),
              scaleType: 'band',
              label: 'Local',
            },
          ]}
          yAxis={[
            { label: 'Quantidade de pessoas' } 
          ]}
          series={[
            {
              data: placeData.map(place => place.favouriteCount ?? 0),
              color: '#FBD574',
            },
          ]}
          width={650}
          height={350}
        />
      </Grid>
    </Grid>
  )
}
