import classes from './Register.module.css'
import Page from '../../UI/Page/Page'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import { useNavigate, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import RegisterForm from '../../UI/forms/RegisterForm/RegisterForm'
import CartMergeModal from '../../UI/modals/CartMergeModal/CartMergeModal'
import padlocksvg from '../../../assets/padlock.svg'
import usersvg from '../../../assets/user.svg'

const userSvgVariants = {
  initial: {
      x: '-100vw',
      rotate: '-180deg'
  },
  animate: {
      x: 0,
      rotate: '-10deg',
      transition: {
          duration: 1.5,
          type: 'spring'
      }
  }
}

const padlockSvgVariants = {
  initial: {
      x: '100vw',
      rotate: '180deg'
  },
  animate: {
      x: 0,
      rotate: '10deg',
      transition: {
          duration: 1.5,
          type: 'spring'
      }
  }
}


const Register = () => {

    const location = useLocation()
    const [redirect, setRedirect] = useState('/')
    if(location?.state?.redirect) setRedirect(location.state.redirect.pathname)
    //location.history.replace()

    const [storedCart, setStoredCart] = useState(null)
    const [viewCartMerge, setViewCartMerge] = useState(false)
    const handleCartMerge = (cart) => {
        setStoredCart(cart)
        setViewCartMerge(true)
    }

  return (
    <Page className={classes.registerPage}>
      <motion.div className={classes.registerContainer}
        initial={{ opacity: 0}}
        animate={{ opacity: 1}}
      >
        <h1 className={classes.header}>Sign up</h1>
        <Divider sx={{ orientation: 'horizontal', width: '80%', margin: 'auto', marginBottom: '4vh' }}/>
        <RegisterForm className={classes.registerForm} viewCartMerge={handleCartMerge}/>
        <CartMergeModal 
          viewCartMerge={viewCartMerge} 
          storedCart={storedCart} 
          setStoredCart={setStoredCart}
          onDismiss={() => setViewCartMerge(false)}
        />
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
    </Page>
  )
}

export default Register