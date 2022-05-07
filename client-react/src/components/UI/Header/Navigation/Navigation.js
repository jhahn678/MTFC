import classes from './Navigation.module.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../../store/reducers/userSlice'
import { resetCart } from '../../../../store/reducers/cartSlice'
import { toast } from 'react-toastify'
import SettingsIcon from '@mui/icons-material/Settings'
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import BookIcon from '@mui/icons-material/Book';
import ArticleIcon from '@mui/icons-material/Article';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NavDrawer from './NavDrawer';
import Divider from '@mui/material/Divider';
import SearchBar from '../Search/SearchBar/SearchBar'

const navItem = {
    hover: {
      scale: 1.2
    },
    tap: {
      scale: .8
    }
  }
  
  const navItemProps = {
      variants: navItem,
      whileHover: 'hover',
      whileTap: 'tap'
  }

  const activeStyle = {
    fontSize: '1.5em',
    paddingBottom: '.5em',
    color: 'var(--secondaryDark)',
    textDecoration: 'underline'
  }

const Navigation = () => {

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const menuBreakpoint = useMediaQuery('(max-width:900px)')
    const [open, setOpen] = useState(false)

    const handleLogout = () => {
        dispatch(logout())
        dispatch(resetCart())
        toast.success('Successfully signed out', { position: 'bottom-right'})
    }

    return (
            menuBreakpoint ? 
            <>
                <IconButton onClick={() => setOpen(true)}><MenuIcon fontSize={'large'} sx={{ marginLeft: '1vh' }}/></IconButton>
                <NavDrawer variant='temporary' anchor='left' open={open} onClose={() => setOpen(false)}>
                    <IconButton onClick={() => setOpen(false)} sx={{ alignSelf: 'flex-end', padding: '1vh 2vw'}}><CloseIcon fontSize='large'/></IconButton>
                    <Divider/>
                        <SearchBar alwaysOpen setOpen={setOpen} containerStyle={classes.searchBarContainerMobile}/>
                    <Divider/>
                    <List>
                        <ListItemButton onClick={() => { navigate('/'); setOpen(false) }}>
                            <ListItemIcon><HomeIcon fontSize='large' color='primary'/></ListItemIcon>
                            <ListItemText primary='Home' primaryTypographyProps={{ variant: 'h6' }}/>
                        </ListItemButton>
                        <ListItemButton onClick={() => { navigate('/shop'); setOpen(false) }}>
                            <ListItemIcon><StoreIcon fontSize='large' color='primary'/></ListItemIcon>
                            <ListItemText primary='Shop' primaryTypographyProps={{ variant: 'h6' }}/>
                        </ListItemButton>
                        <ListItemButton onClick={() => { navigate('/blog'); setOpen(false) }}>
                            <ListItemIcon><ArticleIcon fontSize='large' color='primary'/></ListItemIcon>
                            <ListItemText primary='Blog' primaryTypographyProps={{ variant: 'h6' }}/>
                        </ListItemButton>
                        <ListItemButton onClick={() => { navigate('/about'); setOpen(false) }}>
                            <ListItemIcon><BookIcon fontSize='large' color='primary'/></ListItemIcon>
                            <ListItemText primary='About' primaryTypographyProps={{ variant: 'h6' }}/>
                        </ListItemButton>
                        <ListItemButton onClick={() => { navigate('/contact'); setOpen(false) }}>
                            <ListItemIcon><AlternateEmailIcon fontSize='large' color='primary'/></ListItemIcon>
                            <ListItemText primary='Contact' primaryTypographyProps={{ variant: 'h6' }}/>
                        </ListItemButton>
                        <Divider sx={{ margin: '3vh 0 2vh'}}/>
                        { user.isAuthenticated ? 
                            <>
                                <ListItemText primary={`Welcome, ${user.firstName}.`} 
                                    primaryTypographyProps={{ 
                                        sx: {
                                            fontSize: '1em',
                                            marginLeft: '1em'
                                        }
                                    }}
                                />
                                <ListItemButton onClick={() => { navigate('/account'); setOpen(false);  }}>
                                    <ListItemIcon><SettingsIcon fontSize='large' color='primary'/></ListItemIcon>
                                    <ListItemText primary='My Account' primaryTypographyProps={{ variant: 'h6' }}/>
                                </ListItemButton>
                                <ListItemButton onClick={() => { navigate('/orders'); setOpen(false) }}>
                                    <ListItemIcon><ReceiptIcon fontSize='large' color='primary'/></ListItemIcon>
                                    <ListItemText primary='My Orders' primaryTypographyProps={{ variant: 'h6' }}/>
                                </ListItemButton>
                                <Divider sx={{ margin: '4vh 0 2vh'}}/>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemText primary='Sign Out' primaryTypographyProps={{ sx: { fontSize: '1em' }}}/>
                                </ListItemButton>
                            </> :
                            <>
                                <ListItemButton onClick={() => { navigate('/login', { state: { redirect: location.pathname} }); setOpen(false) }}>
                                    <ListItemIcon><LoginIcon fontSize='large' color='primary'/></ListItemIcon>
                                    <ListItemText primary='Sign In' primaryTypographyProps={{ variant: 'h6' }}/>
                                </ListItemButton>
                                <ListItemButton onClick={() => { navigate('/register', { state: { redirect: location.pathname} }); setOpen(false) }}>
                                    <ListItemIcon><PersonAddIcon fontSize='large' color='primary'/></ListItemIcon>
                                    <ListItemText primary='Register' primaryTypographyProps={{ variant: 'h6' }}/>
                                </ListItemButton>
                            </>
                        }
                    </List>
                    <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/fisherman.svg' alt='fisherman svg' className={classes.svg}/>
                </NavDrawer>
            </> :
            <ul className={classes.navGroup}>
                <motion.li {...navItemProps}>
                    <NavLink to='/' className={classes.navLink} style={({isActive}) => isActive ? activeStyle : null}>Home</NavLink>
                </motion.li>
                <motion.li {...navItemProps}>
                    <NavLink to='/shop' className={classes.navLink} style={({isActive}) => isActive ? activeStyle : null}>Shop</NavLink>
                </motion.li>
                <motion.li {...navItemProps}>
                    <NavLink to='/blog' className={classes.navLink} style={({isActive}) => isActive ? activeStyle : null}>Blog</NavLink>
                </motion.li>
                <motion.li {...navItemProps}>
                    <NavLink to='/about' className={classes.navLink} style={({isActive}) => isActive ? activeStyle : null}>About</NavLink>
                </motion.li>
                <motion.li {...navItemProps}>
                    <NavLink to='/contact' className={classes.navLink} style={({isActive}) => isActive ? activeStyle : null}>Contact</NavLink>
                </motion.li>
            </ul> 
    )
}

export default Navigation