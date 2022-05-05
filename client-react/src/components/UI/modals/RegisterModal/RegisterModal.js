import classes from './RegisterModal.module.css'
import Modal from '../Modal'
import Divider from '@mui/material/Divider'
import { AnimatePresence } from 'framer-motion'
import RegisterForm from '../../forms/RegisterForm/RegisterForm'


const RegisterModal = ({ viewRegister, handleUserCart, onDismiss }) => {

    return (
        <AnimatePresence>
        {viewRegister &&
            <Modal className={classes.registerModal} onDismiss={onDismiss}>
                <h2 className={classes.registerModalHeader}>Register</h2>
                <Divider sx={{width: '70%', margin: 'auto'}}/>
                <RegisterForm  className={classes.registerForm} handleUserCart={handleUserCart} onDismiss={onDismiss}/>
            </Modal>
        }
        </AnimatePresence>
        
    )
}

export default RegisterModal