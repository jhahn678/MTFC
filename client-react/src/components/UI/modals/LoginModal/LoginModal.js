import classes from './LoginModal.module.css'
import Modal from '../Modal'
import LoginForm from '../../forms/LoginForm/LoginForm'
import Divider from '@mui/material/Divider'
import { AnimatePresence } from 'framer-motion'


const LoginModal = ({ viewLogin, handleCartMerge, onDismiss }) => {

    return (
        <AnimatePresence>
        {viewLogin && 
            <Modal className={classes.loginModal} onDismiss={onDismiss}>
                <h2 className={classes.loginModalHeader}>Sign In</h2>
                <Divider sx={{width: '70%', margin: 'auto'}}/>
                <LoginForm className={classes.loginForm} onDismiss={onDismiss} handleCartMerge={handleCartMerge}/>
            </Modal>
        }
        </AnimatePresence>
    )
}

export default LoginModal;