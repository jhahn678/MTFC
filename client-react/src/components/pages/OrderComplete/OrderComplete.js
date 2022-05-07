import classes from './OrderComplete.module.css'
import Page from '../../UI/Page/Page'
import basket from '../../../assets/basket.svg'
import Button from '@mui/material/Button'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useDeleteCartMutation } from '../../../store/services/endpoints/cartEndpoints'
import { resetCart } from '../../../store/reducers/cartSlice'
import { motion } from 'framer-motion'
import arrow from '../../../assets/arrow.svg'

const imageVariants = {
    initial: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1.5,
            type: 'tween'
        }
    }
}

const svgVariants = {
    initial: {
        x: '100vw'
    },
    visible: {
        x: 0,
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
}

const OrderComplete = () => {

    const navigate = useNavigate()
    const cartState = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    const [ deleteCartMutation ] = useDeleteCartMutation()

    useEffect(() => {
        if(cartState.id){
            deleteCartMutation(cartState.id)
            dispatch(resetCart())
        }
    },[cartState.id])

    return (
        <Page className={classes.orderCompletePage}>
            <motion.img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/fly-fish-mountains.jpg' alt='fly fishing in mountains' 
                className={classes.image}
                variants={imageVariants}
                initial='initial'
                animate='visible'
            />
            <div className={classes.content}>
                <motion.img src={basket} alt='Basket svg' className={classes.watermark}
                    variants={svgVariants}
                    initial='initial'
                    animate='visible'
                />
                <h4 className={classes.paymentSuccessful}>Payment Successful</h4>
                <h1 className={classes.header}>Thanks for ordering!</h1>
                <p className={classes.text}>We have been notified of your order and are currently preparing it. 
                    You should receive an email with a receipt and an order number shortly.
                    If you have an account, you can view your orders here!
                </p>
                <div className='fr' style={{ marginTop: '2vh' }}>
                <Button variant='outlined' onClick={() => navigate('/orders')} sx={{ alignSelf: 'flex-start' }}>My orders</Button>
                <img src={arrow} alt='arrow' className={classes.arrow}/>
                </div>
            </div>
        </Page>
    )
}

export default OrderComplete