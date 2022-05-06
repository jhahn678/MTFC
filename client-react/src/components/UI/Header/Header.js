import React from 'react'
import classes from './Header.module.css'
import Logo from './Logo/Logo'
import CartIcon from './CartIcon/CartIcon'
import useMediaQuery from '@mui/material/useMediaQuery';
import ProfileIcon from './ProfileIcon/ProfileIcon'
import SearchIcon from './Search/SearchIcon/SearchIcon'
import Divider from '@mui/material/Divider'
import Navigation from './Navigation/Navigation'


const Header = () => {

  const breakpoint = useMediaQuery('(max-width:900px)')

  return (
      breakpoint ? 
        <div className={classes.mainHeader}>
          <Navigation/>
          <Logo className={classes.logo}/>
          <CartIcon/>
        </div> :

        <div className={classes.mainHeader}>
          <Logo className={classes.logo}/>
          <Navigation/>
          <div className={classes.headerButtons}>
            <SearchIcon/>
            <Divider sx={{margin: '3px', height: '70%'}}orientation='vertical'/>
            <ProfileIcon />
            <Divider sx={{margin: '3px', height: '70%'}}orientation='vertical'/>
            <CartIcon/>
          </div>
        </div>
  )
}

export default Header