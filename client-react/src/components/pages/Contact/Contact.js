import Page from '../../UI/Page/Page'
import classes from './Contact.module.css'
import emailsvg from '../../../assets/email.svg'
import envelopesvg from '../../../assets/phone.svg'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { motion, useAnimation } from 'framer-motion'
import MenuItem from '@mui/material/MenuItem'
import { useEffect, useReducer } from 'react'
import { nameSchema, emailSchema, bodySchema } from '../../../helpers/joi-schemas'
import { imgVariants, headerVariants, letterVariants, envelopeVariants, formVariants, formItemVariants, formSubmittedVariants } from './contact-animations'


const Contact = () => {

  const initialState = {
    fullName: { value: '', touched: false, valid: false, message: null },
    email: { value: '', touched: false, valid: false, message: null },
    category: { value: '' },
    categorySecondary: { value: '', display: false, label: '', isSelect: false, options: [] },
    body: { value: '', touched: false, valid: false, message: null },
    form: { valid: false, submitted: false }
  }
  
  const formReducer = (state, action) => {
    if(action.type === 'FULLNAME'){
      const { fullName } = state;
      fullName.value = action.value;
      fullName.touched = true;
      const { error } = nameSchema.validate(action.value);
      error ? fullName.valid = false : fullName.valid = true;
      error ? fullName.message = error.message : fullName.message = null
      return { ...state, fullName }
    }
    if(action.type === 'EMAIL'){
      const { email } = state;
      email.value = action.value;
      email.touched = true;
      const { error } = emailSchema.validate(action.value)
      error ? email.valid = false : email.valid = true;
      error ? email.message = error.message : email.message = null
      return { ...state, email }
    }
    if(action.type === 'CATEGORY'){
      const { category, categorySecondary } = state;
      category.value = action.value;
      switch(action.value){
        case 'Account':
          categorySecondary.value = ''
          categorySecondary.display = false
          categorySecondary.label = ''
          categorySecondary.isSelect = false
          categorySecondary.options = []
          return { ...state, category, categorySecondary }
        case 'Products':
          categorySecondary.value = ''
          categorySecondary.display = true
          categorySecondary.label = 'Product Name'
          categorySecondary.isSelect = false
          categorySecondary.options = []
          return { ...state, category, categorySecondary }
        case 'Orders':
          categorySecondary.value = ''
          categorySecondary.display = true
          categorySecondary.label = 'Order Number'
          categorySecondary.isSelect = false
          categorySecondary.options = []
          return { ...state, category, categorySecondary }
        case 'Shipping and delivery':
          categorySecondary.value = ''
          categorySecondary.display = true
          categorySecondary.label = 'Order Number'
          categorySecondary.isSelect = false
          categorySecondary.options = []
          return { ...state, category, categorySecondary }
        case 'General questions':
          categorySecondary.value = ''
          categorySecondary.display = false
          categorySecondary.label = ''
          categorySecondary.isSelect = false
          categorySecondary.options = []
          return { ...state, category, categorySecondary }
      }
    }
    if(action.type === 'CATEGORY_SECONDARY'){
      const { categorySecondary } = state;
      categorySecondary.value = action.value
      return { ...state, categorySecondary }
    }
    if(action.type === 'BODY'){
      const { body } = state;
      body.value = action.value
      body.touched = true
      const { error } =  bodySchema.validate(action.value);
      error ? body.message = error.message : body.message = null
      error ? body.valid = false : body.valid = true
      return { ...state, body }
    }
    if(action.type === 'FORM'){
      const { fullName, email, body, form } = state;
      if(fullName.valid && email.valid && body.valid){
        form.valid = true;
        return { ...state, form}
      }
    }
    if(action.type === 'SUBMIT'){
      const { form } = state;
      form.submitted = true;
      return { ...state, form }
    }
    if(action.type === 'RESET'){
      return initialState;
    }
    return state;
  }

  //Form state reducer
  const [contactForm, formDispatch] = useReducer(formReducer, initialState)

  //Validate full form every time a field validity changes 
  useEffect(() => {
    formDispatch({ type: 'FORM' })
  },[contactForm.fullName.valid, contactForm.email.valid, contactForm.body.valid])

  //Handles population of secondary category select
  const categoryChangeHandler = (e) => {
    if(e.target.value === 'Products'){
      formDispatch({ type: 'CATEGORY', value: e.target.value })
    }else{
      formDispatch({ type: 'CATEGORY', value: e.target.value})
    }
  }

  const formAnimationControl = useAnimation()

  useEffect(() => {
    if(contactForm.form.submitted){
      formAnimationControl.start('onSubmit')
    }else{
      formAnimationControl.start('animate')
    }
  }, [contactForm.form.submitted])

  return (
    <Page className={classes.contactPage}>
      <motion.img variants={imgVariants} initial='initial' animate='animate' src={emailsvg} alt={'@ svg image'} className={classes.emailSvg}/>
      <motion.div className={classes.contactForm}
        variants={formVariants}
        initial='initial'
        animate={formAnimationControl}
      >
        <motion.h1 className={classes.header} 
          variants={headerVariants}
          initial='initial'
          animate='animate'
        >
          <motion.span variants={letterVariants} className={classes.letter}>C</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>o</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>n</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>t</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>a</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>c</motion.span>
          <motion.span variants={letterVariants} className={classes.space}>t</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>u</motion.span>
          <motion.span variants={letterVariants} className={classes.letter}>s</motion.span>
        </motion.h1>

        <motion.div className={classes.input} variants={formItemVariants}>
          <TextField required label='Name' sx={{ width: '100%'}}
            error={contactForm.fullName.touched && !contactForm.fullName.valid}
            helperText={contactForm.fullName.message}
            value={contactForm.fullName.value} 
            InputProps={{ sx: { backgroundColor: 'var(--lightTransparent)'}}}
            onInput={e => formDispatch({ type: 'FULLNAME', value: e.target.value})} 
          />
        </motion.div>
        <motion.div className={classes.input} variants={formItemVariants}>
          <TextField required label='Email'  sx={{ width: '100%'}}
            error={contactForm.email.touched && !contactForm.email.valid}
            helperText={contactForm.email.message}
            value={contactForm.email.value} 
            InputProps={{ sx: { backgroundColor: 'var(--lightTransparent)'}}}
            onInput={e => formDispatch({ type: 'EMAIL', value: e.target.value })}
          />
        </motion.div>
        <motion.div className={classes.input} variants={formItemVariants}>
          <TextField select label='Category' value={contactForm.category.value} onChange={categoryChangeHandler} sx={{ width: '100%'}}>
            <MenuItem value='Account'>Account</MenuItem>
            <MenuItem value='Products'>Products</MenuItem>
            <MenuItem value='Orders'>Orders</MenuItem>
            <MenuItem value='Shipping and delivery'>Shipping and delivery</MenuItem>
            <MenuItem value='General questions'>General questions</MenuItem>
          </TextField>
        </motion.div>
        {
          contactForm.categorySecondary.display &&
          <motion.div className={classes.input} variants={formItemVariants}>
            <TextField select={contactForm.categorySecondary.isSelect}
              label={contactForm.categorySecondary.label} 
              value={contactForm.categorySecondary.value} 
              onChange={e => formDispatch({ type: 'CATEGORY_SECONDARY', value: e.target.value })}
              sx={{ width: '100%'}}
            >
            </TextField>
          </motion.div>
        }
        <motion.div className={classes.input} variants={formItemVariants}>
          <TextField multiline required 
            label='Body' 
            value={contactForm.body.value} 
            error={contactForm.body.message}
            helperText={contactForm.body.message}
            onInput={e => formDispatch({ type: 'BODY', value: e.target.value })} 
            minRows={2}
            maxRows={4}
            sx={{ width: '100%'}}
          />
        </motion.div>
        <motion.div variants={formItemVariants} >
          <Button disabled={!contactForm.form.valid} 
            onClick={() => formDispatch({ type: 'SUBMIT' })} 
            variant='contained' size='large' 
            sx={{ width: '100%'}}
          >Submit</Button>
        </motion.div>
        <motion.img variants={envelopeVariants} src={envelopesvg} alt='envelope svg' className={classes.envelopeSvg}/>
        <motion.div variants={formSubmittedVariants} className={classes.submitted}>
            <h2>Message sent! Please allow 48 hours for us to respond.</h2>
            <Button variant='contained' disabled={!contactForm.form.submitted} onClick={() => formDispatch({ type: 'RESET' })} sx={{ marginTop: '2vh'}}>Reset form</Button>
        </motion.div>
      </motion.div>
    </Page>
  )
}

export default Contact;