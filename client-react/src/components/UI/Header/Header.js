import React from 'react'
import classes from './Header.module.css'
import Logo from './Logo/Logo'
import CartIcon from './CartIcon/CartIcon'
import ProfileIcon from './ProfileIcon/ProfileIcon'
import SearchBar from './Search/SearchBar'
import Divider from '@mui/material/Divider'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'

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




const Header = () => {

  const activeStyle = {
    fontSize: '1.5em',
    paddingBottom: '.5em',
    color: 'var(--secondaryDark)',
    textDecoration: 'underline'
  }

  return (
      <div className={classes.mainHeader}>
        <Logo className={classes.logo}/>
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
        <div className={classes.headerButtons}>
          <SearchBar />
          <Divider sx={{margin: '3px', height: '70%'}}orientation='vertical'/>
          <ProfileIcon />
          <Divider sx={{margin: '3px', height: '70%'}}orientation='vertical'/>
          <CartIcon/>
        </div>
      </div>
  )
}

export default Header