import classes from './AccountDetailsForm.module.css'
import { useReducer, useEffect } from 'react'
import { useSelector } from "react-redux"
import { useUpdateAccountDetailsMutation } from "../../../../store/services/endpoints/userEndpoints"
import { toast } from 'react-toastify' 
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import profilesvg from '../../../../assets/profile.svg'
import { motion } from 'framer-motion'
import { emailSchema, nameSchema, phoneSchema } from '../../../../helpers/joi-schemas'

const initialState = {
  firstName: { value: '', touched: false, valid: false, message: null },
  lastName: { value: '', touched: false, valid: false, message: null },
  email: { value: '', touched: false, valid: false, message: null },
  phone: { value: '', touched: false, valid: false, message: null },
  form: { touced: false  }
}

const formReducer = (state, action) => {
  if(action.type === 'FIRSTNAME'){
    const { form } = state;
    form.touched = true;
    const { error } = nameSchema.validate(action.value)
    const firstName = { value: action.value, touched: true, valid: error ? false : true, message: error ? error.message : null }
    return { ...state, firstName, form }
  }
  if(action.type === 'LASTNAME'){
    const { form } = state;
    form.touched = true;
    const { error } = nameSchema.validate(action.value)
    const lastName = { value: action.value, touched: true, valid: error ? false : true, message: error ? error.message : null }
    return { ...state, lastName, form }
  }
  if(action.type === 'EMAIL'){
    const { form } = state;
    form.touched = true;
    const { error } = emailSchema.validate(action.value)
    const email = { value: action.value, touched: true, valid: error ? false : true, message: error ? error.message : null }
    return { ...state, email, form }
  }
  if(action.type === 'PHONE'){
    const { form } = state;
    form.touched = true;
    const { error } = phoneSchema.validate(action.value)
    const phone = { value: action.value, touched: true, valid: error ? false : true, message: error ? error.message : null }
    return { ...state, phone, form }
  }
  if(action.type === 'SET_FORM'){
    const firstName = { value: action.userDetails.firstName || '', touched: false, valid: true, message: null }
    const lastName = { value: action.userDetails.lastName || '', touched: false, valid: true, message: null }
    const email = { value: action.userDetails.email || '', touched: false, valid: true, message: null }
    const phone = { value: action.userDetails.phone || '', touched: false, valid: true, message: null }
    const form = { touched: false }
    return { ...state, firstName, lastName, email, phone, form }
  }
}

const AccountDetailsForm = ({ userDetails, setUserUpdate }) => {
  
  //Select userId from user state
  const userId = useSelector((state) => state.user.userId)

  //config form state and reducer
  const [formState, dispatch] = useReducer(formReducer, initialState)

  //populate form with users details
  useEffect(() => {
    dispatch({ type: 'SET_FORM', userDetails: userDetails })
  },[])

  const [ updateUserAccountMutation ] = useUpdateAccountDetailsMutation()

  const handleSave = async (e) => {
    e.preventDefault()
    const { firstName, lastName, email, phone } = formState;
    const accountUpdate = {
      'account.firstName': firstName.value,
      'account.lastName': lastName.value,
      'account.email': email.value,
      'account.phone': phone.value
    }
    const res = await updateUserAccountMutation({ id: userId, patch: accountUpdate}).unwrap()
    if(res.error){
      toast.error('Error: Account not updated')
    }else{
      toast.info('Account updated')
      setUserUpdate(true)
    }
  }

  return (
    <>
      <form className={classes.accountDetailsForm}>
          <TextField label='First name' value={formState.firstName.value} 
            onInput={(e) => dispatch({ type: 'FIRSTNAME', value: e.target.value })}
            className={classes.input} error={!formState.firstName.valid && formState.firstName.touched}
            helperText={formState.firstName.message}
          />
          <TextField label='Last name' value={formState.lastName.value} 
            onInput={(e) => dispatch({ type: 'LASTNAME', value: e.target.value })}
            className={classes.input} error={!formState.lastName.valid && formState.lastName.touched}
            helperText={formState.lastName.message}
          />
          <TextField label='Email' value={formState.email.value} 
            onInput={(e) => dispatch({ type: 'EMAIL', value: e.target.value })}
            className={classes.input} error={!formState.email.valid && formState.email.touched}
            helperText={formState.email.message}
          />
          <TextField label='Phone' value={formState.phone.value} 
            onInput={(e) => dispatch({ type: 'PHONE', value: e.target.value })}
            className={classes.input} error={!formState.phone.valid && formState.phone.touched}
            helperText={formState.phone.message}
          />
          <Button variant='contained' onClick={handleSave}
            disabled={!formState.form.touched || !formState.firstName.valid || !formState.lastName.valid || !formState.email.valid || !formState.phone.valid}
          >Save</Button>
      </form>
      <motion.img src={profilesvg} alt='avatar svg' className={classes.image}
        initial={{ x: '50vw' }}
        animate={{ x: 0, transition: { duration: .7, type: 'spring' } }}
      />
    </>
  )
}

export default AccountDetailsForm