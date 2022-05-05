import classes from './ProductCard.module.css'
import { motion, useAnimation } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

const ProductCard = ({ product }) => {

  const navigate = useNavigate()
  const cardAnimations = useAnimation()
  const [showCardBack, setShowCardBack] = useState(false)

  // On card mount fade in
  useEffect(() => {
    cardAnimations.start({
      opacity: 1,
      transition: {
        duration: .7,
        type: 'tween'
      }
    })
  },[])

  //Handles card flip animation on hover. Timers prevent unnecessary flips
  useEffect(() => {
    //On hover start, showCardBack is set to true.
    if(showCardBack){
      //Flip card over only if its been hovered on for 300ms
      const flipTimer = setTimeout(() => {
        cardAnimations.start({
          rotateY: 180,
          transition: {
            duration: .2
          }
        })
      }, 300)
      return () => {
        clearTimeout(flipTimer)
      }
    }
    //On hover end, showCardBack is set to false
    if(!showCardBack){
      //Flip card back only if its been hovered off for 500ms
      const flipTimer = setTimeout(() => {
        cardAnimations.start({
          rotateY: 0,
          transition: {
            duration: .3
          }
        })
      }, 500)
      return () => {
        clearTimeout(flipTimer)
      }
    }
  },[showCardBack])

  const [price, setPrice] = useState('')

  useEffect(() => {
    setPrice(() => {
      if(product.price.min_price === product.price.max_price) return `$${product.price.min_price}`
      if(product.price.min_price !== product.price.max_price) return `$${product.price.min_price} - $${product.price.max_price}`
    })
  },[])


  return (
    <motion.div className={classes.productCard}
      initial={{ opacity: 0 }}
      animate={cardAnimations}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: .95 }}
      onHoverStart={() => setShowCardBack(true)}
      onHoverEnd={() => setShowCardBack(false)}
      onTap={() => navigate(`/product/${product.slug}`)}
    >

      <motion.div className={classes.cardFront}>
        <h3 className={classes.itemName}>{product.name}</h3>
        <img src={product.images[0]} alt={product.name} className={classes.image}/>
        <p className={classes.price}>{price}</p>
      </motion.div>

      <motion.div className={classes.cardBack}>
        <h2 className={classes.cardBackTitle}>{product.name}</h2>
        { product.description.split(' ').length > 35 ? 
            <p className='fc'>{product.description.split(' ').slice(0, 35).join(' ')} 
                <MoreHorizIcon onClick={() => navigate(`/product/${product.slug}`)} sx={{ cursor: 'pointer'}}/>
            </p> :
            <p>{product.description}</p>
        }
        <p className={classes.cardBackPrice}>{price}</p>
      </motion.div>

    </motion.div>
  )
}

export default ProductCard