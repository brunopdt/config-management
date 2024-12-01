import React from 'react';
import logo from "../../assets/logo.png";
import { Grid, Button, TextField, Typography, Link} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import IconButton from '@mui/material/IconButton';
import { Link as RouterLink } from 'react-router-dom';
import background from '../../assets/background.png';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { UseLoginForm } from "./hook/useLoginForm.tsx";


export const Login = () => {
  
  const {
    formValues,
    handleChange,
    handleSubmit,
  } = UseLoginForm();  

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ position: 'absolute', top: '0', left: '0', right: '0', textAlign: 'left', paddingLeft: '50px', backgroundImage: 'url(../../assets/background.png)' }}>

      <img src={background} alt="Background" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '850px',   objectFit: 'contain', zIndex: '-1' }} />
      <img src={logo} alt="Logo" style={{ maxHeight: '100vh', width: 'auto' }} />

      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '52vh' }}>
        
        <Grid item xs={12} sm={6} md={4} sx={{ border: '1px ', borderRadius: '30px', padding: '55px', maxWidth: '500px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.35)' }}>
          <Typography variant="h3" fontWeight="fontWeightMedium" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#87432D' }}>
            Login
          </Typography>

          <Typography variant="h5" fontWeight="fontWeightMedium" mb={3}  sx={{ fontFamily: 'Inter, sans-serif',  color: '#000000' }}>
            Bem vindo de volta!
          </Typography>

          <TextField
            required
            size="medium"
            label="E-mail"
            name="username"
            variant= "standard"           
            fullWidth
            margin="normal"            
            value={formValues.username}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <PersonOutlineOutlinedIcon color="action" sx={{ fontSize: 34 }} />
              ),
              style: { fontSize: '25px' }
            }}
            sx={{ '& .MuiInputBase-input': { fontSize: '25px' } }}
          />
          <TextField
            required
            size="medium"
            name="password"
            label="Senha"
            variant="standard"
            fullWidth
            margin="normal"
            value={formValues.password}
            onChange={handleChange}
            InputProps={{
              type: showPassword ? 'text' : 'password',
              endAdornment: (                
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} >
                    {showPassword ? <VisibilityOff/> : <RemoveRedEyeOutlinedIcon />}
                  </IconButton>                
              ),
              style: { fontSize: '25px' }
            }}
            sx={{ marginBottom: '50px' }}
          />
          <Grid container direction="column" alignItems="center"  sx={{ justifyContent: 'center', textAlign: 'center', minHeight: '10vh' }} > 
            <Grid item xs={12} sx={{ maxWidth: '350px', width: '100%', padding: '0 16px' }}>
              <Button variant="contained" type="submit" style={{ backgroundColor: '#F43734', color: '#FFFFFF', fontSize: 15, width: '100%', maxWidth: '300px', padding: '10px 10px' }}  >
                Login
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '15px'  }}>
              <Link
                  style={{  color: '#BA4300', textDecoration: 'none', borderBottom: '0.1vh solid #BA4300', display: 'flex', justifyContent: 'center', width: '100%' }}
                  sx={{ fontSize: 15 }} 
                  component={RouterLink}
                  to="/esqueciSenha"
                  variant="body2"
                  className='mt'
              >
                  Esqueci minha senha
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
