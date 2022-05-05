import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom'
import { logout } from '../../../../store/reducers/userSlice'
import classes from './ProfileIcon.module.css'
import { Menu, MenuItem, Divider } from '@mui/material';
import IconButton from '@mui/material/IconButton'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import StoreIcon from '@mui/icons-material/Store';
import ListItemIcon from '@mui/material/ListItemIcon';
import LoginModal from '../../modals/LoginModal/LoginModal'
import RegisterModal from '../../modals/RegisterModal/RegisterModal'
import { toast } from 'react-toastify'
import { resetCart } from '../../../../store/reducers/cartSlice';
import CartMergeModal from '../../modals/CartMergeModal/CartMergeModal';

const ProfileIcon = () => {

    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const profileRef = useRef(null)
    const [viewProfile, setViewProfile] = useState(false)

    const [viewLogin, setViewLogin] = useState(false)
    const [viewRegister, setViewRegister] = useState(false)
    const [viewCartMerge, setViewCartMerge] = useState(false)

    const profileClickHandler = () => {
        setViewProfile(v => !v)
    }

    const closeMenuHandler = () => {
        setViewProfile(false)
    }

    const logoutHandler = () => {
        dispatch(logout())
        dispatch(resetCart())
        toast.success('Successfully signed out', { position: 'bottom-right'})
    }
    
    const loginViewHandler = () => {
        setViewLogin(v => !v)
        setViewProfile(false)
    }

    const registerViewHandler = () => {
        setViewRegister(v => !v)
        setViewProfile(false)
    }

    const [storedCart, setStoredCart] = useState(null)
    const handleCartMerge = (cart) => {
        setStoredCart(cart)
        setViewCartMerge(true)
    }


    return (
        <>
            <IconButton onClick={profileClickHandler} ref={profileRef}>
                <AccountCircleIcon fontSize={'large'} sx={{color: 'var(--text)'}}/>
            </IconButton>
            <Menu
                open={viewProfile}
                onClose={closeMenuHandler}
                anchorEl={profileRef.current}
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                PaperProps={{sx: {minWidth: '10em'}}}>
                {
                    user.isAuthenticated ?
                    <div>
                        <h3 style={{padding: '.5em 1em 1em'}}>{user.firstName}</h3>
                        <Divider/>
                        <Link to='/orders'>
                            <MenuItem className={classes.profileMenuItem}>
                                {'Orders'}
                                <ListItemIcon><StoreIcon/></ListItemIcon>
                            </MenuItem>
                        </Link>
                        <Link to='/account'>
                        <MenuItem className={classes.profileMenuItem}>
                            {'Account'}
                            <ListItemIcon><SettingsIcon/></ListItemIcon>
                        </MenuItem>
                        </Link>
                        <Divider />
                        <MenuItem className={classes.profileMenuItem} onClick={logoutHandler}>
                            {'Sign out'}
                            <ListItemIcon><LogoutIcon/></ListItemIcon>
                        </MenuItem>
                    </div> :
                    <div>
                        <MenuItem className={classes.profileMenuItem} onClick={loginViewHandler}>
                            {'Sign in'}
                            <ListItemIcon><LoginIcon/></ListItemIcon>
                        </MenuItem>
                        <Divider />
                        <MenuItem className={classes.profileMenuItem} onClick={registerViewHandler}>
                           {' Register'}
                            <ListItemIcon><PersonAddIcon/></ListItemIcon>
                        </MenuItem>
                    </div>

                }          
            </Menu>
            <LoginModal viewLogin={viewLogin} viewCartMerge={handleCartMerge} onDismiss={loginViewHandler}/>
            <RegisterModal viewRegister={viewRegister} onDismiss={registerViewHandler}/>
            <CartMergeModal 
                viewCartMerge={viewCartMerge} 
                storedCart={storedCart} 
                setStoredCart={setStoredCart}
                onDismiss={() => setViewCartMerge(false)}
            />
        </>
    )
}

export default ProfileIcon