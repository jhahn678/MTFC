import { motion, useAnimation } from "framer-motion"
import classes from './HeroText.module.css'
import Button from '@mui/material/Button'
import StoreIcon from '@mui/icons-material/Store';
import CallIcon from '@mui/icons-material/Call';
import { useEffect } from "react"
import { useNavigate} from 'react-router-dom'
import useMediaQuery from "@mui/material/useMediaQuery";

const container = {
    initial: {
        opacity: 1
    },
    visible: {
        opacity: 1,
        transition: {
            delay: .2,
            duration: 1,
            delayChildren: .2,
            staggerChildren: .1
        }
    }
}

const item = {
    hidden: {
        x: '-100vw'
    },
    visible: {
        x: 0,
        transition: {
            duration: 1.5,
            type: 'spring'
        }
    }
}

const button = {
    hidden: { x: 400, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
        },
    },
}

let firstRender = true;

const HeroText = () =>  {

    const breakpoint = useMediaQuery('(max-width: 575px)')
    const navigate = useNavigate()
    const controls = useAnimation()

    useEffect(() => {
        if(firstRender){
            controls.start('visible')
            firstRender = false;
        }
    }, [])
    

    return (
        <motion.div
            className={classes.mainContainer}
            variants={container}
            initial={firstRender ? 'hidden' : 'visible'}
            animate={controls}
        >
            <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/fishing-scene.svg' 
                alt={'fly fishing vector'} 
                className={classes.bg}
            />
            <motion.h1 className={`${classes.mainText} ${classes.text1}`} variants={item}>
                Hand Crafted
            </motion.h1>
            <motion.h1 className={`${classes.mainText} ${classes.text2}`} variants={item}>
                By Fishermen
            </motion.h1>
            <motion.h1 className={`${classes.mainText} ${classes.text3}`} variants={item}>
                For Fishermen
            </motion.h1>
            <div className={classes.buttonGroup}>
                <motion.div className={classes.mainButton} 
                    variants={button} 
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.08 }}
                >
                    <Button variant='contained' 
                        onClick={() => navigate('/shop')} 
                        endIcon={<StoreIcon/>} 
                        sx={{
                            fontSize: '1.5em', 
                            width: breakpoint ? '100%' : null,
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--text)',
                            '&:hover': {
                                backgroundColor: 'var(--secondaryDark)'
                            }
                        }}
                    >
                        Go to shop
                    </Button>
                </motion.div>
                <motion.div className={classes.mainButton} 
                    variants={button} 
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <Button variant='contained' 
                        onClick={() => navigate('/contact')} endIcon={<CallIcon/>} 
                        sx={{ fontSize: '1.5em', width: breakpoint ? '100%' : null, marginLeft: breakpoint ? 0 : '2vw' }}
                    >
                        Contact us
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export default HeroText;