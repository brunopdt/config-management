import { Grid, Typography } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from "react";
import DashboardEvent from "../../../models/DashboardEvent";

interface PlacesContainerProps {
  events: DashboardEvent[];
}

export const EventsContainer = ({ events }: PlacesContainerProps) => {

  const [eventData, setEventData] = useState<DashboardEvent[]>([]);

  console.log(eventData);

  useEffect(() => {
    setEventData(events);
  }, [events]);

  return (
    <Grid item xs={12} sx={{ border: '1px ', borderRadius: '25px', padding: '20px', maxWidth: '750px', backdropFilter: 'blur(9px)', backgroundColor: 'rgba(245, 238, 238, 0.658)' }}>
      <Typography sx={{ fontSize: 30, textAlign: 'center' }}>Eventos mais populares</Typography>
      <Grid container justifyContent="center" alignItems="center" sx={{ marginBottom: '20px' }}>
        <BarChart
          xAxis={[
            {
              id: 'barCategories',
              data: eventData.map(event => event.name),
              scaleType: 'band',
              label: 'Evento',
            },
          ]}
          yAxis={[
            { label: 'Quantidade de pessoas' }
          ]}
          series={[
            {
              data: eventData.map(event => event.favouriteCount ?? 0),
              color: '#F43734',
            },
          ]}
          width={650}
          height={350}
          sx={{ margin: 'auto' }}
        />
      </Grid>
    </Grid>
  )
}
