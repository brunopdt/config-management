import logo from "../../assets/logo.png";
import { Grid, Button, TextField, Typography, Link} from '@mui/material';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { Link as RouterLink } from 'react-router-dom';
import backgroundSenha from '../../assets/fundo.svg';
import { ForgotPasswordForm } from "./hook/forgotPassword.tsx";


export const ForgotPassword = () => {
  
  const {
    formValues,
    handleChange,
    handleSubmit,
  } = ForgotPasswordForm();  
  
  return (
    <form onSubmit={handleSubmit} style={{ position: 'absolute', top: '0', left: '0', right: '0', textAlign: 'left', paddingLeft: '50px', backgroundImage: 'url(../../assets/background.png)' }}>

      <img src={backgroundSenha} alt="Background" style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '850px',   objectFit: 'contain', zIndex: '-1' }} />
      <img src={logo} alt="Logo" style={{ maxHeight: '100vh', width: 'auto' }} />

      <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '52vh' }}>
        
        <Grid item xs={12} sm={6} md={4} sx={{ border: '1px ', borderRadius: '30px', padding: '55px', maxWidth: '500px', backdropFilter: 'blur(9px)',  backgroundColor: 'rgba(245, 238, 238, 0.35)' }} >
          <Typography variant="h3" fontWeight="fontWeightMedium" sx={{ fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#87432D' }}>
            Esqueci a senha
          </Typography>

          <Typography variant="h5" fontWeight="fontWeightMedium"  sx={{ fontFamily: 'Inter, sans-serif',  color: '#000000' }}>
            Insira o e-mail cadastrado para redefinir sua senha
          </Typography>

          <TextField
            required
            size="medium"
            label="E-mail"
            name="email"
            variant= "standard"           
            fullWidth
            margin="normal"            
            value={formValues.email}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <PersonOutlineOutlinedIcon color="action" sx={{ fontSize: 34 }} />
              ),
              style: { fontSize: '25px' }
            }}
            sx={{ '& .MuiInputBase-input': { fontSize: '25px' }, marginBottom: '50px' }}
          />
          
          <Grid container direction="column" alignItems="center"  sx={{ justifyContent: 'center', textAlign: 'center', minHeight: '10vh' }} > 
            <Grid item xs={12} sx={{ maxWidth: '350px', width: '100%', padding: '0 16px' }} >
              <Button variant="contained" type="submit" style={{ backgroundColor: '#F43734', color: '#FFFFFF', fontSize: 15, width: '100%', maxWidth: '300px', padding: '10px 10px' }} >
                Próximo
              </Button>
            </Grid>    

            <Grid item xs={12} sx={{ textAlign: 'center', marginTop: '15px'  }}>
              <Link
                  style={{  color: '#BA4300', textDecoration: 'none', borderBottom: '0.1vh solid #BA4300', display: 'flex', justifyContent: 'center', width: '100%' }}
                  sx={{ fontSize: 15 }} 
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  className='mt'
              >
                  Voltar para login
              </Link>       
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </form>
  );
};
