import { useState } from 'react'
import classes from './LoginForm.module.css'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../../store/reducers/userSlice'
import { setCart } from '../../../../store/reducers/cartSlice'
import { useSetCartUserMutation } from '../../../../store/services/endpoints/cartEndpoints'
import { useLoginMutation, useGoogleLoginMutation } from '../../../../store/services/endpoints/authEndpoints'
import { toast } from 'react-toastify'
import { GoogleLogin } from 'react-google-login'
import GoogleButton from '../../buttons/GoogleButton'

const LoginForm = ({ className, onDismiss, onRedirect, handleCartMerge }) => {

     //State management
     const dispatch = useDispatch()
     const cartState = useSelector((state) => state.cart)
 
     //Form state
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const emailHandler = (e) => setEmail(e.target.value)
     const passwordHandler = (e) => setPassword(e.target.value)
 
     //Passsword visibility
     const [viewPassword, setViewPassword] = useState(false)
     const viewPasswordHandler = () => setViewPassword(v => !v)
 
     //Login function
     const [login, { isLoading }] = useLoginMutation()
     //Google login function
     const [ googleLoginMutation ] = useGoogleLoginMutation()
 
     //Cart merge API call -- for when user logs in after creating a cart locally
     const [setCartUserMutation ] = useSetCartUserMutation()
 
     //Handles logic for shopping cart after login
     const handleUserCart = (userId, cart, cartModified) => {
         const { id: cartId } = cartState;
         //If theres a stored cart and a local cart
         if(cart && cartId){
             setCartUserMutation({ userId, cartId })
             handleCartMerge(cart)
         }
         //If theres only a stored cart
         else if(cart){
             const transformedItems = cart.items.map(item => {
                 return{
                     variant: item.variant,
                     quantity: item.quantity
                 }
             })
             dispatch(setCart({ items: transformedItems, cartId: cart._id }))
             //If server modified stored cart due to items being no longer available
             if(cartModified) toast.info('One or more items previously in your cart are no longer available, and were removed.', { postition: 'top-right', delay: 1000 })
             onRedirect && onRedirect()
         }
         //If theres only a local cart
         else if(cartId){
             setCartUserMutation({ cartId, userId })
             onRedirect && onRedirect()
         }
     }

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try{
            const { userId, firstName, token, cart, cartModified } = await login({ email: email.toLowerCase(), password }).unwrap()
            dispatch(setUser({ userId, firstName, token }))
            handleUserCart(userId, cart, cartModified)
            setEmail('')
            setPassword('')
            onDismiss && onDismiss() 
            toast.success('Signed in successfully!')
        }catch(err){
            setEmail('')
            setPassword('')
            toast.error('Invalid credentials')
        }
    }

    const handleGoogleLogin = async (res) => {
        if(res.tokenId){
            try{
                const { userId, firstName, token, cart, cartModified } = await googleLoginMutation({token: res.tokenId }).unwrap()
                dispatch(setUser({ userId, firstName, token }))
                handleUserCart(userId, cart, cartModified)
                toast.success('Signed in successfully!')
                onDismiss && onDismiss()
            }catch(err){
                toast.error('Could not authenticate')
            }
        }else{
            toast.error('Cannot connect to Google')
        }
    }

    return (
        <form className={`${classes.loginForm} ${className}`}>
            <TextField value={email} 
                onInput={emailHandler} 
                variant='outlined'
                sx={{ marginBottom: '1vh'}} 
                placeholder='Email' label='Email'/>
            <TextField value={password}
                type={viewPassword ? 'text' : 'password'} 
                InputProps={{
                    endAdornment:   <IconButton onClick={viewPasswordHandler}>
                                        {viewPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                }}
                onInput={passwordHandler} 
                variant='outlined' 
                sx={{ marginBottom: '2vh'}} 
                placeholder='Password' label='Password'/>
            <Button type='submit' variant='contained' onClick={handleLoginSubmit} sx={{ padding: '12px' }}>
                {isLoading ? <CircularProgress variant='indeterminate'/> : 'Sign in'}
            </Button>
            <div className={classes.or}>
                <div className={classes.line}></div>
                <p>or</p>
                <div className={classes.line}></div>
            </div>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={handleGoogleLogin}
                onFailure={handleGoogleLogin}
                render={renderProps => 
                    <GoogleButton
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled}
                    >
                        Login with Google
                    </GoogleButton>
                }
            />
        </form>
    )
}

export default LoginForm