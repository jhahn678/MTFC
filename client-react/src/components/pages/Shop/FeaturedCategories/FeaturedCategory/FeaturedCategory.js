import classes from '../FeaturedCategories.module.css'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'framer-motion'

const FeaturedCategory = ({ category }) => {

    const navigate = useNavigate()
    const [hover, setHover] = useState(false)

    return (
        <motion.div className={`${classes.categoryShortcut} ${hover && classes.categoryShortcutHover}`} 
            key={category._id} 
            whileHover={{ scale: 1.05, backgroundColor: 'var(--secondaryTransparent)'}}
            onHoverStart={() => setHover(true)}
            onHoverEnd={() => setHover(false)}
            onClick={() => navigate(`/shop/${category.slug}`)}
        >
            <h2 className={`${classes.title} ${hover && classes.titleHover}`}>Browse {category.name}</h2>
            <img src={category.meta.image} 
                alt={`${category.name} svg`} 
                className={classes.image}
            />
        </motion.div>
    )
}

export default FeaturedCategory