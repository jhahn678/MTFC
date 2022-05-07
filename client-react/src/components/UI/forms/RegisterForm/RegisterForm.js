import classes from './RegisterForm.module.css'
import { useState, useEffect, useReducer } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress, IconButton } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../../../../store/reducers/userSlice'
import { setCart } from '../../../../store/reducers/cartSlice';
import { useRegisterMutation, useGoogleLoginMutation } from '../../../../store/services/endpoints/authEndpoints'
import { useSetCartUserMutation } from '../../../../store/services/endpoints/cartEndpoints';
import { toast } from 'react-toastify'
import { nameSchema, emailSchema, passwordSchema } from '../../../../helpers/joi-schemas'
import { GoogleLogin } from 'react-google-login'
import GoogleButton from '../../buttons/GoogleButton'

const initialState = {
    firstName: {value: '', touched: false, isValid: false, message: null},
    lastName: {value: '', touched: false, isValid: false, message: null},
    email: {value: '', touched: false, isValid: false, message: null},
    password: {value: '', touched: false, isValid: false, message: null},
    passwordConfirm: {value: '', touched: false, isValid: false, message: null},
    terms: {touched: false, isValid: false, message: null},
    form: {isValid: false}
}

const formReducer = (state, action) => {
    if(action.type == 'FIRST_NAME'){
        const { firstName } = state;
        firstName.value = action.value;
        firstName.touched = true;
        const { error } = nameSchema.validate(action.value);
        error ? firstName.isValid = false : firstName.isValid = true;
        error ? firstName.message = error.message : firstName.message = null;
        return{...state, firstName}
    }
    if(action.type == 'LAST_NAME'){
        const { lastName } = state;
        lastName.value = action.value;
        lastName.touched = true;
        const { error } = nameSchema.validate(action.value);
        error ? lastName.isValid = false : lastName.isValid = true;
        error ? lastName.message = error.message : lastName.message = null;
        return{...state, lastName}
    }
    if(action.type == 'EMAIL'){
        const { email } = state;
        email.value = action.value;
        email.touched = true;
        const { error } = emailSchema.validate(action.value);
        error ? email.isValid = false : email.isValid = true;
        error ? email.message = error.message : email.message = null;
        return{...state, email}
    }
    if(action.type == 'PASSWORD'){
        const { password } = state;
        password.value = action.value;
        password.touched = true;
        const { error } = passwordSchema.validate(action.value);
        error ? password.isValid = false : password.isValid = true;
        error ? password.message = error.message : password.message = null;
        return{...state, password}
    }
    if(action.type == 'PASSWORD_CONFIRM'){
        const { passwordConfirm } = state;
        passwordConfirm.value = action.value;
        passwordConfirm.touched = true;
        passwordConfirm.isValid = (action.value === state.password.value);
        (passwordConfirm.value !== state.password.value) ? 
        passwordConfirm.message = 'Password confirmation does not match' : passwordConfirm.message = null
        return{...state, passwordConfirm}
    }
    if(action.type == 'TERMS'){
        const { terms } = state;
        terms.touched = true;
        terms.isValid = action.checked;
        terms.isValid ? terms.message = null : terms.message = 'This is required'
        return{...state, terms}
    }
    if(action.type == 'VALIDATE_FORM'){
        const {firstName, lastName, email, password, passwordConfirm, terms, form} = state;
        (firstName.isValid && lastName.isValid && email.isValid && password.isValid && passwordConfirm.isValid && terms.isValid) ?
        form.isValid = true : form.isValid = false;
        return{...state, form}
    }
    return state;
}


const RegisterForm = ({ className, onDismiss, onRedirect, handleCartMerge }) => {

    const dispatch = useDispatch()
    const cartState = useSelector((state) => state.cart)

    const [formState, formDispatch] = useReducer(formReducer, initialState)

    const [ register, { isLoading: registerLoading } ] = useRegisterMutation()
    const [ googleLoginMutation ] = useGoogleLoginMutation()
    const [ setCartUserMutation ] = useSetCartUserMutation()

    const [viewPassword, setViewPassword] = useState(false)

    const viewPasswordHandler = () => {
        setViewPassword( v => !v )
    }

    useEffect(() => {
        formDispatch({ type: 'VALIDATE_FORM' })
    }, [
        formState.firstName.isValid,
        formState.lastName.isValid,
        formState.email.isValid,
        formState.password.isValid,
        formState.passwordConfirm.isValid,
        formState.terms.isValid
    ])


    const registerSubmitHandler = async (e) => {
        e.preventDefault()
        try{
            const { userId, firstName, token } = await register({
                firstName: formState.firstName.value, 
                lastName: formState.lastName.value, 
                email: formState.email.value, 
                password: formState.password.value, 
                passwordConfirm: formState.passwordConfirm.value }).unwrap()
            dispatch(setUser({ userId, firstName, token }))
            if(cartState.cartId){
                setCartUserMutation({ cartId: cartState.cartId, userId: userId })
            }
            onDismiss && onDismiss()
            toast.success('Account created successfully!')
        }catch(err){
            console.log(err)
            toast.error('Something went wrong')
        }
    }

    //Only used in the google sign up function -- in case user already exists
    const handleUserCart = (userId, cart, cartModified) => {
        const { cartId } = cartState;
        //If theres a stored cart and a local cart
        if(cart && cartId){
            setCartUserMutation({ userId, cartId })
            handleCartMerge(cart)
        }
        //If theres only a stored cart
        else if(cart){
            const transformedItems = cart.items.map(item => {
                return{
                    id: item.itemId._id,
                    itemName: item.itemId.itemName,
                    unitPrice: item.itemId.unitPrice,
                    image: item.itemId.image,
                    quantity: item.quantity,
                    options: item.options
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

    const handleGoogleLogin = async (res) => {
        if(res.tokenId){
            try{
                const { userId, firstName, token, cart, cartModified } = await googleLoginMutation({ token: res.tokenId }).unwrap()
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
        <form className={`${classes.form} ${className}`}>
            <TextField value={formState.firstName.value} 
                helperText={formState.firstName.message} 
                error={!formState.firstName.isValid && formState.firstName.touched} 
                onInput={e => formDispatch({type:'FIRST_NAME', value: e.target.value})} 
                variant='outlined' placeholder='First name' label='First name'
                sx={{ marginBottom: '1vh'}}/>
            <TextField value={formState.lastName.value} 
                helperText={formState.lastName.message} 
                error={!formState.lastName.isValid && formState.lastName.touched} 
                onInput={e =>formDispatch({type:'LAST_NAME', value: e.target.value})}
                variant='outlined' placeholder='Last name' label='Last name'
                sx={{ marginBottom: '1vh'}}/>
            <TextField value={formState.email.value} 
                helperText={formState.email.message} 
                error={!formState.email.isValid && formState.email.touched} 
                onInput={e => formDispatch({type:'EMAIL', value: e.target.value})}
                variant='outlined' placeholder='Email' label='Email'
                sx={{ marginBottom: '1vh'}}/>
            <TextField value={formState.password.value} 
                type={viewPassword ? 'text' : 'password'} 
                helperText={formState.password.message}
                InputProps={{
                    endAdornment:   <IconButton onClick={viewPasswordHandler}>
                                        {viewPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                }}
                error={!formState.password.isValid && formState.password.touched} 
                onInput={e => formDispatch({type:'PASSWORD', value: e.target.value})}
                variant='outlined' placeholder='Password' label='Password'
                sx={{ marginBottom: '1vh'}}/>
            <TextField value={formState.passwordConfirm.value} 
                type={viewPassword ? 'text' : 'password'} 
                helperText={formState.passwordConfirm.message}
                InputProps={{
                    endAdornment:   <IconButton onClick={viewPasswordHandler}>
                                        {viewPassword ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                }}
                error={!formState.passwordConfirm.isValid && formState.passwordConfirm.touched} 
                onInput={e => formDispatch({type:'PASSWORD_CONFIRM', value: e.target.value})}
                variant='outlined' placeholder='Confirm password' label='Confirm password'
                sx={{ marginBottom: '1vh'}}/>
            <FormControlLabel className={classes.formControlLabel} 
                onChange={e => formDispatch({type:'TERMS', checked: e.target.checked})} 
                control={<Checkbox/>} 
                label="By checking this box you agree to the terms and services of GJSnacks" 
                sx={{ marginBottom: '1vh'}}/>
            <Button type='submit' 
                variant='contained' 
                disabled={!formState.form.isValid} 
                onClick={registerSubmitHandler} 
                sx={{padding: '12px'}}>
                    {registerLoading ? <CircularProgress variant='indeterminate'/> : 'Create Account'}
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
                        Sign up with Google
                    </GoogleButton>
                }
            />
        </form>
    )
}

export default RegisterForm;