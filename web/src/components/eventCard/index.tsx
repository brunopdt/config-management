import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Avatar } from '@mui/material';
import locationIcon from "../../assets/locationIcon.png";

interface EventCardProps {
    eventName?: string;
    location?: string;
    date?: string;
    hour?: string;
}

function EventCard({ eventName, location, date, hour }: EventCardProps) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item>
                        <Avatar src={locationIcon} alt="Logo" sx={{ display: { xs: 'none', md: 'flex' }, marginRight: 1, width: 70, height: 70 }} />
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h6" component="h2" gutterBottom>
                            {eventName}
                        </Typography>
                        <Typography variant="body1" color="textSecondary" gutterBottom>
                            {location}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {date}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            {hour}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}

export default EventCard;

