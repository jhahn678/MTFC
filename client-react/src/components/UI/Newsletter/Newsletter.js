import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { emailSchema } from '../../../helpers/joi-schemas'
import classes from './Newsletter.module.css'
import mailbox from '../../../assets/mailbox.svg'
import InputBase from '@mui/material/InputBase'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import SendIcon from '@mui/icons-material/Send';
import { motion } from 'framer-motion'

const imageVariants = {
    initial: {
        x: '-60vw'
    },
    animate: {
        x: 0,
        transition: {
            duration: 2,
            delay: .3,
            type: 'spring'
        }
    }
}

const Newsletter = () => {

    const [input, setInput] = useState('')
    const [valid, setValid] = useState(false)

    useEffect(() => {
        setValid(!emailSchema.validate(input).error)
    }, [input])

    const submitHandler = (e) => {
        e.preventDefault();
        toast.success('Email added to newsletter!')
        setInput('')
    }

    return (
        <motion.div className={classes.container}
            initial='initial'
            whileInView='animate'
            viewport={{ once: true }}
        >
            <section className={classes.left}>
                <motion.img src={mailbox} alt='mailbox watermark' className={classes.watermark} variants={imageVariants}/>
            </section>
            <section className={classes.right}>
                <h1>Wanna be kept in the loop?</h1>
                <h3>Be the first to know about new products and get exclusive, email-only discounts</h3>
                <Paper className={classes.emailContainer}>
                    <InputBase
                        placeholder='Email address'
                        className={classes.emailInput}
                        value={input}
                        onInput={(e) => setInput(e.target.value)}
                    />
                    <IconButton disabled={!valid} color='secondary' onClick={submitHandler}><SendIcon/></IconButton>
                </Paper>
            </section>
        </motion.div>
  )
}

export default Newsletter