import classes from './CustomOrders.module.css'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const containerVariants = {
    initial: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            delayChildren: .5,
            staggerChildren: .2
        }
    }
}

const imgVariants = {
    initial: {
        x: '100vw',
    },
    visible: {
        x: 0,
        transition: {
            duration: 1,
            type: 'spring'
        }
    }
}

const contentVariants = {
    initial: {
        x: '-100vw',
    },
    visible: {
        x: 0,
        transition: {
            duration: 1,
            type: 'spring'
        }
    }
}

let firstRender = true

const CustomOrders = () => {

    const navigate = useNavigate()

    useEffect(() => {
        firstRender = false;
    }, [])

    return (
        <>
        <motion.main className={classes.container}
            variants={containerVariants}
            initial={firstRender ? 'initial' : 'visible'}
            whileInView='visible'
            viewport={{once: true}}
        >
            <div className={classes.left}>
                <motion.h1 variants={contentVariants} viewport={{once: true}} className={classes.heading}>
                    Fly Assortments
                </motion.h1>
                <motion.p variants={contentVariants} viewport={{once: true}} className={classes.text}>
                    Need a handpicked fly assortment for an upcoming fly fishing trip? We've got you covered.
                    We offer a wide range of pre-bundled fly assortments, for a variety of locations and species.
                    These assortments are selected by the hardened fly fishing veterans of Mountain Trout Fly Co.
                </motion.p>
                <motion.span
                    variants={contentVariants}
                    style={{ transformOrigin: 'left', width: 'fit-content'}}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: .9 }}
                    viewport={{once: true}}
                >
                    <Button variant='outlined' size='large' onClick={() => navigate('/contact')}className={classes.button}>Fly assortments</Button>
                </motion.span>
            </div>
            <div className={classes.right}>
                <motion.img variants={imgVariants} 
                    viewport={{once: true}} 
                    src='https://storage.googleapis.com/mtfc-products/MTFC-svg/beadhead-pheasant-tail.svg' 
                    alt='beadhead pheasant tail svg' 
                    className={classes.watermark}
                />
            </div>
        </motion.main>
        <div className='divider'/>
        </>
    )
}

export default CustomOrders