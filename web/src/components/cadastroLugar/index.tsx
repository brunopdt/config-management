import { useState, useCallback } from 'react'
import logo from '../../assets/logo.png'
import { Grid, Button, TextField, Typography, Box } from '@mui/material'
import { useApi } from '../../apis/axiosInstance'
import { useNavigate } from 'react-router-dom'
import Navbar from '../navBar'
import { RegisterLugarModel } from '.'
import local from '../../assets/local.png'

export const CadastroLugar = () => {
  const navigate = useNavigate()
  const [namePlace, setNamePlace] = useState('')
  const [longitude, setLongitude] = useState(0.0)
  const [latitude, setLatitude] = useState(0.0)

  const register = useCallback(async () => {
    try {
      const lugar: RegisterLugarModel = {
        name: namePlace,
        latitude: Number(latitude),
        longitude: Number(longitude)
      }
      await useApi.post('places', lugar)
      navigate('/')
    } catch (error) {
      console.error(JSON.stringify(error))
    }
  }, [namePlace, latitude, longitude, navigate])

  return (
    <>
      <Navbar />

      <Box px={2} py={1} sx={{position: 'absolute'}}>
          <Grid container alignItems="center" spacing={2}>
              <Grid item xs={12} sm={6}>
                  <img src={logo} alt="Logo" style={{ width: '200%', maxWidth: '200px' }} />
              </Grid>
          </Grid>
      </Box>
      <Grid container component="main" sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '130px' }} >
        <Grid item xs={12} sm={7} sx={{ border: '1px', borderRadius: '30px', padding: '50px', backdropFilter: 'blur(9px)', backgroundColor: 'rgba(245, 238, 238, 0.35)' }}>
          
         <Grid container direction={{ xs: 'column-reverse', sm: 'row' }}>
            <Grid item xs={12} sm={9}>
              <Typography variant="h3" fontWeight="fontWeightMedium" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#87432D', }}>
                Cadastrar localidade
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <img src={local} alt="Local" style={{ maxHeight: '95%', maxWidth: '60%', minWidth: '40%', alignSelf: 'flex-start', paddingLeft: '50px' }} />
            </Grid>
          </Grid>

          <TextField
            required
            label="Nome do Local"
            name="evento"
            variant="standard"
            fullWidth
            margin="normal"
            value={namePlace}
            onChange={e => setNamePlace(e.target.value)}
          />

          <TextField
            required
            label="Longitude"
            name="Longitude"
            variant="standard"
            fullWidth
            type="number"
            margin="normal"
            onChange={(e: any) => setLongitude(e.target.value)}
            value={longitude}
          />

          <TextField
            required
            label="Latitude"
            name="Latitude"
            variant="standard"
            fullWidth
            type="number"
            margin="normal"
            onChange={(e: any) => setLatitude(e.target.value)}
            value={latitude}
          />
           
          <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '15px'  }}>
            <Button variant="contained" type="submit" onClick={register} style={{ backgroundColor: '#F43734', color: '#FFFFFF', fontSize: 15, width: '100%', maxWidth: '300px', padding: '10px 10px' }}  >
              Cadastrar
            </Button>
          </Grid>

        </Grid>
      </Grid>
    </>
  )
}
