import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuItem from '@mui/material/MenuItem'
import logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'

const pages = [
  { name: 'Cadastrar Local', route: '/cadastroLugar' },
  { name: 'Cadastrar Evento', route: '/cadastroEvento' },
  { name: 'Dashboard', route: '/dashboard' }
]

function Navbar() {
  const navigate = useNavigate()

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleLogout = () => {
    navigate('/login')
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleNavigation = (route: string) => {
    navigate(route)
    handleCloseNavMenu()
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#F43734' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            src={logo}
            alt="Logo"
            sx={{
              display: { xs: 'none', md: 'flex' },
              marginRight: 1,
              width: 70,
              height: 70
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          />

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' }
              }}
            >
              {pages.map(page => (
                <MenuItem
                  key={page.name}
                  onClick={() => handleNavigation(page.route)}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Avatar
            src={logo}
            alt="Logo"
            sx={{
              display: { xs: 'flex', md: 'none' },
              marginRight: 1,
              width: 70,
              height: 70
            }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none'
            }}
          />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(page => (
              <Button
                key={page.name}
                onClick={() => handleNavigation(page.route)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleLogout} sx={{ p: 0 }}>
              <LogoutIcon sx={{ color: '#3E241C' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Navbar
