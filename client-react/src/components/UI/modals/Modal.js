import React from 'react'
import ReactDOM from 'react-dom'
import classes from './Modal.module.css'
import { motion } from 'framer-motion'

export const Backdrop = (props) => {
    return(
        <motion.div className={`${classes.backdrop} ${props.className}`} 
            onClick={props.onDismiss}
            initial={{opacity: 0}} 
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            {props.children}
        </motion.div>
    )
}

const modalVariants = {
    initial: { y: '-100vh' },
    animate: {
        y: 0,
        transition: {
            delayChildren: .3,
            staggerChildren: .1
        }
    },
    exit: { y: '-100vh' }
}

const Modal = (props) => {
    return(
        ReactDOM.createPortal(
            <Backdrop onDismiss={props.onDismiss}>
                <motion.div className={`${classes.modal} ${props.className}`}
                    onClick={e => e.stopPropagation()}
                    variants={modalVariants}
                    initial='initial'
                    animate='animate'
                    exit='exit'
                >
                    {props.children}
                </motion.div>
            </Backdrop>,
        document.getElementById('modal-root'))
    )
}

export default Modal;
