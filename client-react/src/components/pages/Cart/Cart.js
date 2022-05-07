import Page from '../../UI/Page/Page'
import CartList from './CartList/CartList'
import CartItem from './CartItem/CartItem'
import CartSummary from './CartSummary/CartSummary'
import classes from './Cart.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { resetCart } from '../../../store/reducers/cartSlice'
import { useDeleteCartMutation } from '../../../store/services/endpoints/cartEndpoints'
import { AnimatePresence } from 'framer-motion'
import Button from '@mui/material/Button'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

const Cart = () => {

  //config redux
  const dispatch = useDispatch()
  const cartState = useSelector((state) => state.cart)

  //Cancelled stripe session redirects to cart.
  //This checks if order flow was cancelled and displays toast
  const location = useLocation()
  useEffect(() => {
    if(location.search === '?order_cancelled'){
      const timer = setTimeout(() => {
        toast.info('Order cancelled')
      }, 1000)
      return () => {
        clearTimeout(timer)
      }
    }
  },[])

  //Handles empty cart button click
  const [ deleteCartMutation ] = useDeleteCartMutation()
  const handleEmptyCart = () => {
    deleteCartMutation(cartState.id)
    dispatch(resetCart())
  }

  return (
    <Page className={classes.cartPage}>
      <CartList>
        {cartState.items.length < 1 &&
           <h1 className={classes.empty}>
            <span className={classes.word}>Your </span>
            <span className={classes.word}>cart </span>
            <span className={classes.word}>is </span>
            <span className={classes.word}>empty </span>
          </h1>
        }
        <AnimatePresence>
        {cartState.items.length >= 1 &&
          cartState.items.map(item => 
            <CartItem key={item.variant._id} variant={item.variant} quantity={item.quantity}
            />
          )
        }
        </AnimatePresence>
        { cartState.items.length >= 1 && 
          <Button onClick={handleEmptyCart} 
            variant='outlined'
            endIcon={<DeleteSweepIcon/>} 
            sx={{ margin: '3vh 2vw' }}
          >Empty cart</Button>}
      </CartList>
      <CartSummary checkoutNow={location.search === '?checkout' ? true : false}/>
    </Page>
  )
}

export default Cart;