import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Fab from '@mui/material/Fab'
import { motion } from 'framer-motion'


const ScrollButton = () => {

    const scrollHandler = () => {
        window.scrollBy({
            top: (window.innerHeight * .9),
            left: 0,
            behavior: 'smooth'
          });
    }

    return (
        <motion.div
            style={{display: 'inline-block', position: 'absolute', right: '3vw', bottom: '5vh'}}
            animate = {{
                y: [0, -10, 0, -10, 0, -10, 0],
                rotate: [0, 0, 0, 0, 0, 360, 360]
            }}
            transition={{
                duration: 4,
                repeat: 'Infinity', 
                repeatType: 'loop',
            }}
            whileTap={{scale: .9}}
            whileHover={{scale: 1.2}}
        >
            <Fab color='secondary' onClick={scrollHandler}>
                <ArrowDownwardIcon />
            </Fab>
        </motion.div>
    )
}

export default ScrollButton