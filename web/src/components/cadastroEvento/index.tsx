import { useState, useCallback, useEffect } from 'react'
import logo from '../../assets/logo.png'
import { Grid, Button, TextField, Typography, Switch, Autocomplete, FormControlLabel, Box } from '@mui/material'
import { RegisterEventoModel, PlaceState } from './index'
import { useApi } from '../../apis/axiosInstance'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navBar'
import { AxiosResponse } from 'axios'

export const CadastroEvento = () => {
  const navigate = useNavigate()
  const [nameEvent, setNameEvent] = useState('')
  const [date, setDate] = useState('')
  const [place, setPlace] = useState<PlaceState | null>()
  const [placeOptions, setPlaceOptions] = useState<PlaceState[]>([])
  const [hour, setHour] = useState('')
  const [hideHour, setHideHour] = useState(false)

  const handleChangeCheckBox = () => {
    hideHour ? setHideHour(false) : setHideHour(true)
  }

  const handleSelectionChange = (value: PlaceState | null) => {
    setPlace(value)
  }

  const handleSetPlaceOptions = async () => {
    const response = await useApi.get<void, AxiosResponse<PlaceState[]>>('places')
    setPlaceOptions(response.data)
  }

  useEffect(() => {
    handleSetPlaceOptions()
  }, [])

  const register = useCallback(async () => {
    try {
      const evento = {
        placeId: place?.id,
        date: new Date(date).toISOString(),
        duration: hideHour ? undefined : hour,
        fullDay: hideHour,
        name: nameEvent
      } as RegisterEventoModel
      await useApi.post('events', evento)
      navigate('/')
    } catch (error) {
      console.error(JSON.stringify(error))
    }
  }, [place?.id, date, hour, hideHour, nameEvent, navigate])

  return (
    <>
      <Navbar />
      <Box px={2} py={1} sx={{ position: 'absolute' }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={6}>
            <img src={logo} alt="Logo" style={{ width: '200%', maxWidth: '200px' }} />
          </Grid>
        </Grid>
      </Box>
      <Grid container component="main" sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '100px' }} >
        <Grid item xs={12} sm={7} md={5} sx={{ border: '1px', borderRadius: '30px', padding: '50px', backdropFilter: 'blur(9px)', backgroundColor: 'rgba(245, 238, 238, 0.35)' }}>

          <Typography variant="h3" fontWeight="fontWeightMedium" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#87432D', }} marginBottom={3}>
            Cadastrar evento
          </Typography>

          <TextField
            required
            label="Nome do evento"
            name="name"
            InputLabelProps={{ shrink: true, required: true, style: { fontSize: 20 } }}
            variant="standard"
            fullWidth
            margin="normal"
            value={nameEvent}
            onChange={e => setNameEvent(e.target.value)}
          />

          <Grid container spacing={2} alignItems="center" marginTop={2}>
            <Grid item xs={8}>
              <Autocomplete
                disablePortal
                value={place}
                onChange={(_, value) => handleSelectionChange(value)}
                options={placeOptions}
                getOptionLabel={(place) => place.name}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                renderInput={params => (
                  <TextField {...params} label="Local do Evento" />
                )}
              />
            </Grid>
            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <FormControlLabel
                control={<Switch color="warning" />}
                label="Dia inteiro?"
                labelPlacement="start"
                checked={hideHour}
                onClick={handleChangeCheckBox}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center" marginTop={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                label="Data"
                name="data"
                type="date"
                InputLabelProps={{ shrink: true, required: true }}
                variant="standard"
                fullWidth
                margin="normal"
                value={date}
                onChange={e => setDate(e.target.value)}
              />
            </Grid>
            {!hideHour && (
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  label="Horário"
                  name="data"
                  type="time"
                  variant="standard"
                  fullWidth
                  margin="normal"
                  value={hour}
                  onChange={e => setHour(e.target.value)}
                />
              </Grid>
            )}
          </Grid>

          <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '30px' }}>
            <Button variant="contained" type="submit" onClick={register} style={{ backgroundColor: '#F43734', color: '#FFFFFF', fontSize: 15, width: '100%', maxWidth: '300px', padding: '10px 10px' }}  >
              Cadastrar
            </Button>
          </Grid>

        </Grid>


      </Grid>
    </>
  )
}
