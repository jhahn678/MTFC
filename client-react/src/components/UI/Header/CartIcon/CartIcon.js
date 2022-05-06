import { useState, useEffect } from 'react'
import classes from './Cart.module.css'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import { Button, Tooltip, Divider } from '@mui/material'
import CartDrawer from './CartDrawer'
import CartBadge from './CartBadge';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import CartItem from './CartItem'
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '../../../../store/reducers/cartSlice';
import { useLazyGetCartQuery } from '../../../../store/services/endpoints/cartEndpoints';
import { useNavigate } from 'react-router-dom'
import { v4 as uuid } from 'uuid'
import { toast } from 'react-toastify'

const CartIcon = () => {

    const navigate = useNavigate()

    //Select state and prepare dispatch
    const cartState = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    //Cart query API call function
    const [ getCartQuery, { data, isSuccess, isError, error: queryError} ] = useLazyGetCartQuery()

    //On mount, check if cart id exists in local storage. If so start query
    useEffect(() => {
        const storedCartId = localStorage.getItem('CART_ID')
        if(storedCartId) getCartQuery(storedCartId)
    }, [])

    //After query completes, use response to set state
    useEffect(() => {
        if(isSuccess){
            dispatch(setCart({
                items: data.items,
                cartId: data._id
            }))
            //if server modified cart due to items being no longer available
            if(data.modified) toast.info('One or more items previously in your cart are no longer available, and were removed.', 
                { postition: 'top-right', delay: 1000 })
        }
        if(isError && queryError.status === 404){
            localStorage.removeItem('CART_ID')
        }
        if(isError && queryError.status === 409){
            console.log(queryError)
            localStorage.removeItem('CART_ID')
            toast.error('The item(s) previously in your cart are no longer available', { position: 'top-right', delay: 1000 })
            
        }
    }, [isSuccess, isError])

    //Set cart drawer as open or closed
    const[cartDrawer, setCartDrawer] = useState(false) 

    const handleGoToCart = () => {
        setCartDrawer(state => !state)
        navigate('/cart')
    }

    const handleGoToCheckout = () => {
        setCartDrawer(state => !state)
        navigate('/cart?checkout')
    }

    return (
        <>
            <Tooltip title='View cart'>
                <IconButton aria-label='View cart' onClick={() => setCartDrawer(state => !state)} sx={{ marginRight: '1vw'}}>
                    <CartBadge badgeContent={cartState.quantity} color={'success'}>  
                        <ShoppingCartIcon className={classes.cartIcon} fontSize={'large'}/>
                    </CartBadge>
                </IconButton>
            </Tooltip>
            <CartDrawer anchor={'right'} open={cartDrawer} onClose={() => setCartDrawer(state => !state)}>
                <header className={classes.cartDrawerHeader}>
                <IconButton onClick={() => setCartDrawer(false)} sx={{ alignSelf: 'flex-end', padding: '1vh 2vw'}}>
                    <CloseIcon fontSize='large'/>
                </IconButton>
                    <h2>Cart</h2>
                </header>
                <Divider orientation='horizontal' />
                <section className={classes.cartDrawerList}>
                    {cartState.items.map(item => 
                        <CartItem 
                            key={uuid()}
                            variant={item.variant}
                            quantity={item.quantity}
                        />)
                    }
                </section>
                {cartState.quantity > 0 ? 
                    <div className={classes.cartOrderSummary}>
                        <h3>Cart Summary</h3>
                        <div className={classes.cartOrderSummaryInfo}>
                        <p>{`Subtotal: $${cartState.total.toFixed(2)}`}</p>
                            <p>Tax: Calculated at checkout</p>
                            <p>{`Total: $${cartState.total.toFixed(2)}`}</p>
                        </div>
                        <div className={classes.buttonGroup}>
                            <Button variant='outlined' onClick={handleGoToCart}>Go to cart</Button>
                            <Button variant='contained' className={classes.checkoutButton}
                                endIcon={<ShoppingCartCheckoutIcon />}
                                disabled={!cartState.quantity > 0}
                                onClick={handleGoToCheckout}
                                sx={{ marginRight: '1em' }}
                            >
                                {'Checkout'}
                            </Button>
                        </div>
                    </div> :
                    <>
                        <h2 className={classes.cartEmpty}>Your cart is empty</h2>
                        <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/fisherman-casting.svg' 
                            alt='fisherman casting' style={{ width: '80%', margin: '2vh auto' }}/>
                    </>
                }
            </CartDrawer>
        </>
  )
}

export default CartIcon