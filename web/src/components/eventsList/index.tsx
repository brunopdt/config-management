import { useState, useEffect, useCallback } from 'react';
import Navbar from '../navBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import logo from '../../assets/logo.png';
import EventCard from '../eventCard';
import Pagination from '@mui/material/Pagination';
import Event from '../../models/Event';
import eventsService from '../../service/eventsService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const EventsList = () => {
    const [page, setPage] = useState(1);
    const [events, setEvents] = useState<Event[]>([]);
    const navigate = useNavigate();

    const fetchEvents = async () => {
        try {
            const response: Event[] = (await eventsService.getEvents()).data;
            setEvents(response);
        } catch (error) {
            console.error('Erro ao buscar eventos: ', error);
        }
    };

    const validateLogin = useCallback(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        validateLogin();
        fetchEvents();
    }, [validateLogin]);

    const handleChangePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const formatDate = (date: string) => {
        const actualDate = new Date(date);
        return format(actualDate, 'dd/MM/yyyy');
    };

    const itemsPerPage = 6;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    return (
        <>
            <Navbar />
            <Box px={2} py={1}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <img src={logo} alt="Logo" style={{ width: '100%', maxWidth: '200px' }} />
                    </Grid>
                </Grid>
            </Box>
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <Grid container spacing={2} xs={12} sm={8} md={6} lg={9}>
                    {events.slice(startIndex, endIndex).map((event, index) => (
                        <Grid item xs={6} key={index}>
                            <EventCard
                                eventName={event.name}
                                location={event.Place?.name}
                                date={formatDate(event.date ?? 'N/A')}
                                hour={event.duration}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={Math.ceil(events.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
        </>
    );
};
