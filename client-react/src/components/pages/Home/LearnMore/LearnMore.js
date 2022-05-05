import classes from './LearnMore.module.css'
import Button from '@mui/material/Button'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const containerVariants = {
    initial: {
        opacity: 0
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 1,
            delayChildren: .3,
            staggerChildren: .2
        }
    }
}

const imgVariants = {
    initial: {
        x: '-100vw'
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
        x: '100vw'
    },
    visible: {
        x: 0,
        transition: {
            duration: 1,
            type: 'spring'
        }
    }
}

let firstRender = true;

const LearnMore = () => {

    const navigate = useNavigate()

    useEffect(() => {
        firstRender = false;
    },[])

    return (
        <>
            <motion.main className={classes.container}
                variants={containerVariants}
                initial={firstRender ? 'initial' : 'visible'}
                whileInView='visible'
                viewport={{once: true}}
            >
                <section className={classes.left}>
                    <motion.img variants={imgVariants} className={classes.watermark} src={'https://storage.googleapis.com/mtfc-products/MTFC-svg/klinkhammer.svg'} alt='klinkhammer fly svg'/>
                </section> 
                <section className={classes.right}>
                    <div className={classes.content}>
                        <motion.h1 variants={contentVariants} viewport={{once: true}}><span>Quality</span> materials <span>Quality</span> craftsmanship.</motion.h1>
                        <motion.p variants={contentVariants} viewport={{once: true}}>
                            MTFC strongly believes that quality flies translate to not only more fish in the net,
                            but a better overall fly fishing experience. No more cheap flies that fall apart after
                            several outings. Our flies come with a season long guarentee. Learn more below.
                        </motion.p>
                        <motion.span
                            variants={contentVariants}
                            className={classes.button}
                            style={{ transformOrigin: 'right'}}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: .9 }}
                            viewport={{once: true}}
                        >
                            <Button sx={{ width: '100%', marginTop: '3vh'}} variant='outlined' size='large' onClick={() => navigate('/about')}>Learn more</Button>
                        </motion.span>
                    </div>
                </section>
            </motion.main>
            <div className='divider'/>
        </>
    )
}

export default LearnMore