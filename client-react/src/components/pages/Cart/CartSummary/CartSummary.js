import classes from './CartSummary.module.css'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout'
import { useStartCheckoutMutation } from '../../../../store/services/endpoints/checkoutEndpoints'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'react-toastify'
import { Backdrop } from '../../../UI/modals/Modal'



//Creates stripe promise to be used in stripe session
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE)

const CartSummary = (props) => {

  //Function fetches stripe token from server
  const [ getStripeToken ] = useStartCheckoutMutation()
  const cartState = useSelector((state) => state.cart)

  //Loading spinner is set if for express checkout redirect
  const [isLoading, setIsLoading] = useState(true)

  //Redirect user to stripe checkout page
  const handleCheckout = async () => {
    const stripe = await stripePromise
    const { sessionId } = await getStripeToken({ cartId: cartState.id }).unwrap()
    setIsLoading(false)
    const res = await stripe.redirectToCheckout({
      sessionId: sessionId
    })
    if(res.error) toast.error(res.error.message)
  }

  //Checkout redirect from side drawer cart, auto initialize stripe checkout session
  useEffect(() => {
    if(props.checkoutNow === true){
      handleCheckout()
    }else{
      setIsLoading(false)
    }
  },[])

  return (
    <>
    {isLoading && 
      <Backdrop className={classes.loading}>
        <CircularProgress size={100} sx={{color: 'var(--background)'}} />
      </Backdrop>
    }
    <motion.div className={classes.cartSummary}>
      <motion.h2 className={classes.header}>Cart Summary</motion.h2>
      <motion.p className={classes.summaryItem}>
        <span>Subtotal: </span>
        <span> ${(cartState.total).toFixed(2)}</span>
      </motion.p>
      <motion.p className={classes.summaryItem}>
        <span>Tax: </span>
        <span>Calculated at checkout</span>
      </motion.p>
      <motion.p className={classes.summaryItem}>
        <span>Shipping: </span>
        <i>{'Choose at checkout'}</i> 
      </motion.p>
      <motion.p className={classes.summaryItem}>
        <b>Total:</b>
        <b>${ cartState.total.toFixed(2) }</b>
      </motion.p>

      <Button variant='contained'
        disabled={cartState.total <= 0}
        endIcon={<ShoppingCartCheckoutIcon/>}
        onClick={handleCheckout}
        sx={{ marginTop: '5vh'}}
      >Checkout Now</Button>
    </motion.div>
    </>
  )
}

export default CartSummary;

// {stripeToken && 
//   <Elements stripe={stripePromise} options={{ clientSecret: stripeToken, appearance: appearance }} key={stripeToken}>
//     <CheckoutModal stripeToken={stripeToken}
//       viewCheckout={viewCheckout} 
//       onDismiss={() => setViewCheckout(false)}
//     />
//   </Elements>
// }