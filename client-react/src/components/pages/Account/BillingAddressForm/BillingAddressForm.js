import classes from './BillingAddressForm.module.css'
import { useReducer, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useUpdateAccountDetailsMutation } from '../../../../store/services/endpoints/userEndpoints'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import fiftyStates from '../../../../helpers/states'
import { toast } from 'react-toastify'
import creditcardsvg from '../../../../assets/credit-card.svg'
import { motion } from 'framer-motion'

const initialState = {
    name: { value: '', touched: '', valid: '' },
    line1: { value: '', touched: '', valid: '' },
    line2: { value: '' },
    city: { value: '', touched: '', valid: '' },
    state: { value: '', touched: '' },
    postal_code: { value: '', touched: '', valid: ''},
    form: { touched: false }
}

const formReducer = (state, action) => {
    if(action.type === 'NAME'){
        const form = { touched: true }
        const name = { value: action.value, touched: true, valid: true}
        return{ ...state, name, form }
    }
    if(action.type === 'LINE1'){
        const form = { touched: true }
        const line1 = { value: action.value, touched: true, valid: false}
        return{ ...state, line1, form }
    }
    if(action.type === 'LINE2'){
        const form = { touched: true }
        const line2 = { value: action.value, touched: true, valid: false}
        return{ ...state, line2, form }
    }
    if(action.type === 'CITY'){
        const form = { touched: true }
        const city = { value: action.value, touched: true, valid: false}
        return{ ...state, city, form }
    }
    if(action.type === 'STATE'){
        const form = { touched: true }
        const address_state = { value: action.value, touched: true}
        return{ ...state, state: address_state, form }
    }
    if(action.type === 'POSTAL'){
        const form = { touched: true }
        const postal_code = { value: action.value, touched: true, valid: false}
        return{ ...state, postal_code, form }
    }
    if(action.type === 'SET_ADDRESS'){
        const name = { value: action.billingAddress.name || '', touched: false, valid: true }
        const line1 = { value: action.billingAddress.line1 || '', touched: false, valid: true } 
        const line2 = { value: action.billingAddress.line2 || '', touched: false, valid: true } 
        const city = { value: action.billingAddress.city || '', touched: false, valid: true } 
        const address_state = { value: action.billingAddress.state || '', touched: false, valid: true } 
        const postal_code = { value: action.billingAddress.postal_code || '', touched: false, valid: true }
        const form = { touched: false }
        return { ...state, name, line1, line2, city, state: address_state, postal_code }
    }
}

const BillingAddressForm = ({ billingAddress, setUserUpdate }) => {

    //state config
    const userId = useSelector((state) => state.user.userId)

    //Shipping address form reducer
    const [formState, dispatch] = useReducer(formReducer, initialState)

    //On load, populate form with passed in shipping address
    useEffect(() => {
        dispatch({ type: 'SET_ADDRESS', billingAddress: billingAddress})
    },[])

    //API call function for user details patch
    const [ updateAccountDetailsMutation ] = useUpdateAccountDetailsMutation()

    //Handle updating shipping address
    const handleSave = async (e) => {
        e.preventDefault()
        const { name, line1, line2, city, state, postal_code} = formState;
        const billingAddress = {
            name: name.value == '' ? null : name.value,
            line1: line1.value == '' ? null : line1.value,
            line2: line2.value == '' ? null : line2.value,
            city: city.value == '' ? null : city.value,
            state: state.value == '' ? null : state.value,
            postal_code: postal_code.value == '' ? null : postal_code.value
        }
        const res = await updateAccountDetailsMutation({ id: userId, patch: { billingAddress: billingAddress } }).unwrap()
        if(res.error){
          toast.error('Error: Account not updated')
      }else{
          setUserUpdate(true)
          toast.info('Account updated')
      }
    }

    return (
        <>
            <form className={classes.billingAddressForm}>
                <TextField label='Name' value={formState.name.value} 
                    onChange={(e) => dispatch({ type: 'NAME', value: e.target.value})}
                    className={classes.input}
                />
                <TextField label='Line 1' value={formState.line1.value} 
                    onChange={(e) => dispatch({ type: 'LINE1', value: e.target.value})}
                    className={classes.input}
                />
                <TextField label='Line 2' value={formState.line2.value} 
                    onChange={(e) => dispatch({ type: 'LINE2', value: e.target.value})}
                    className={classes.input}
                />
                <div className='fr'>
                    <TextField label='City' value={formState.city.value} 
                        onChange={(e) => dispatch({ type: 'CITY', value: e.target.value})} 
                        sx={{ flexGrow: '5'}} className={classes.input}/>
                    <TextField select label='State' value={formState.state.value} 
                        onChange={(e) => dispatch({ type: 'STATE', value: e.target.value})} 
                        sx={{ flexGrow: '2', marginLeft: '5px'}} className={classes.input}
                    >
                        { fiftyStates.map(st => <MenuItem key={st} value={st}>{st}</MenuItem>)}
                    </TextField>
                </div>
                <div className='fr'>
                    <TextField label='Postal Code' value={formState.postal_code.value} 
                        onChange={(e) => dispatch({ type: 'POSTAL', value: e.target.value})} 
                        sx={{ flexGrow: '3'}} className={classes.input}
                    />
                    <TextField value={'US'} disabled={true} sx={{flexGrow: '1', marginLeft: '5px'}} className={classes.input}/>
                </div>
                <Button variant='contained' 
                    onClick={handleSave}
                    disabled={!formState.form.touched}
                >Save</Button>
            </form>
            <motion.img src={creditcardsvg} alt='credit card svg' className={classes.image}
                initial={{ x: '50vw' }}
                animate={{ x: 0, transition: { duration: .7, type: 'spring' } }}
            />
        </>
    )
}

export default BillingAddressForm