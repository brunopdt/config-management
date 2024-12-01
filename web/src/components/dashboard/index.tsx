import { Grid } from '@mui/material';
import { useState, useEffect } from 'react'
import { useApi } from '../../apis/axiosInstance'
import Navbar from '../navBar'
import {UsersTotal} from './components/usersTotal'
import {EventsContainer} from './components/eventsContainer'
import {PlacesContainer} from './components/placesContainer'
import {EventsTotal} from './components/eventsTotal'
import {PlacesTotal} from './components/placesTotal'
import DashboardModel from '../../models/DashboardModel';

export const Dashboard = () => {
    const [apiData, setApiData] = useState<DashboardModel>({
        ValueTotalUsers: 0,
        ValueTotalEvents: 0,
        ValueTotalPlaces: 0,
        top5Places: [],
        top5Events: [],
    });

    const loadDashboardsData = async () => {
        const { data } = await useApi.get('/dashboard');
        setApiData(data);
    }
    
    useEffect(() => {
    loadDashboardsData();
    }, [])

    return (
      <>
        <Navbar />
  
        <Grid container margin={'0 auto'} height={'60vh'} padding={2} >
             <Grid container spacing={2} >
                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <EventsTotal total={apiData.ValueTotalEvents ?? 0 } />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <UsersTotal total={apiData.ValueTotalUsers  ?? 0 } />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={4} >
                    <PlacesTotal total={apiData.ValueTotalPlaces  ?? 0 }/>
                </Grid>
            </Grid>

            <Grid container spacing={2} marginTop={0.2}>
                <Grid item xs={12} sm={12} md={6} >
                    <EventsContainer events={apiData.top5Events ?? []}/>
                </Grid>
                <Grid item xs={12} sm={12} md={6} >
                    <PlacesContainer places={apiData.top5Places ?? []} />
                </Grid>
            </Grid>        
          
        </Grid>
      </>
    );
  };
  