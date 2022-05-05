import classes from './Login.module.css'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import LoginForm from '../../UI/forms/LoginForm/LoginForm'
import CartMergeModal from '../../UI/modals/CartMergeModal/CartMergeModal'
import Page from '../../UI/Page/Page'
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

const Login = () => {

    const navigate = useNavigate()

    const location = useLocation()
    const [redirect, setRedirect] = useState('/')
    if(location?.state?.redirect) setRedirect(location.state.redirect.pathname)

    const [viewCartMerge, setViewCartMerge] = useState(false)

    const [storedCart, setStoredCart] = useState(null)
    const handleCartMerge = (cart) => {
        setStoredCart(cart)
        setViewCartMerge(true)
    }

    return (
        <Page className={classes.loginPage}>
            <motion.div className={classes.loginContainer}
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
            >
                <h1 className={classes.header}>Sign in</h1>
                <Divider sx={{ orientation: 'horizontal', width: '80%', margin: 'auto', marginBottom: '4vh' }}/>
                <LoginForm viewCartMerge={handleCartMerge}/>
                <p className={classes.createAccount}>Dont have an account? 
                    <Button onClick={() => navigate('/register')}>Register</Button>
                </p>
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
                onDismiss={() => setViewCartMerge(false)}
            />
        </Page>
    )
}

export default Login