import classes from './Register.module.css'
import Page from '../../UI/Page/Page'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Divider from '@mui/material/Divider'
import { useNavigate, useLocation } from 'react-router'
import { userSvgVariants, padlockSvgVariants } from './animations'
import { motion } from 'framer-motion'
import RegisterForm from '../../UI/forms/RegisterForm/RegisterForm'
import CartMergeModal from '../../UI/modals/CartMergeModal/CartMergeModal'
import padlocksvg from '../../../assets/padlock.svg'
import usersvg from '../../../assets/user.svg'

const Register = () => {

    const user = useSelector((state) => state.user.isAuthenticated)
  
    const navigate = useNavigate()
    const location = useLocation()
    const [redirect, setRedirect] = useState('/')

    useEffect(() => {
        if(location?.state?.redirect) setRedirect(location.state.redirect)
    },[])

    const [storedCart, setStoredCart] = useState(null)
    const [viewCartMerge, setViewCartMerge] = useState(false)
    const handleCartMerge = (cart) => {
        setStoredCart(cart)
        setViewCartMerge(true)
    }

    const handleRedirect = () => {
      setViewCartMerge(false)
      navigate(redirect)
    }

  return (
    <Page className={classes.registerPage}>
      <motion.div className={classes.registerContainer}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
      >
        {
          user ? 
          <h2 className='frjc'>You are currently signed in.</h2> :
          <>
            <h1 className={classes.header}>Sign up</h1>
            <Divider sx={{ orientation: 'horizontal', width: '80%', margin: 'auto', marginBottom: '4vh' }}/>
            <RegisterForm className={classes.registerForm} handleCartMerge={handleCartMerge} onRedirect={handleRedirect}/>
          </> 
        }
      </motion.div>
      <motion.img src={usersvg} alt='user svg' 
            className={classes.userSvg}
            variants={userSvgVariants}
            initial='initial'
            animate='animate'
        />
        <motion.img src={padlocksvg} alt='padlock svg' 
            className={classes.padlockSvg}
            variants={padlockSvgVariants}
            initial='initial'
            animate='animate'
        />
        <CartMergeModal 
            viewCartMerge={viewCartMerge} 
            storedCart={storedCart} 
            setStoredCart={setStoredCart}
            onDismiss={handleRedirect}
          />
    </Page>
  )
}

export default Register