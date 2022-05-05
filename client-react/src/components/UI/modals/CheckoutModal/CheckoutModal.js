import Modal from '../Modal'
import classes from './CheckoutModal.module.css'
import { PaymentElement } from '@stripe/react-stripe-js'
import { AnimatePresence, motion } from 'framer-motion'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const CheckoutModal = ({ stripeToken, viewCheckout, onDismiss }) => {

    const handleSubmit = (e) => {
        e.preventDefault()
    }

    return (
        <AnimatePresence>
        {viewCheckout &&
            <Modal className={classes.checkoutModal} onDismiss={onDismiss}>
                <form className={classes.checkoutForm} onSubmit={handleSubmit}>
                    <PaymentElement />
                    <div className={classes.buttonGroup}>
                        <Button startIcon={<ArrowBackIcon/>} sx={{ marginRight: '1em' }}>Go Back</Button>
                        <Button type='submit' variant='contained'>Complete order</Button>
                    </div>
                </form>
            </Modal>
        }
        </AnimatePresence>
    )
}

export default CheckoutModal