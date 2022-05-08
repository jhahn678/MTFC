import classes from './ProductGrid.module.css'
import ProductCard from '../ProductCard/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'
import CircularProgress from '@mui/material/CircularProgress';

const headerVariants = {
  initial: {},
  loading: {
    transition: {
      delayChildren: .3,
      staggerChildren: .2,
      repeat: Infinity
    }
  }
}

const letterVariants = {
  initial: {
    y: 0
  },
  loading: {
    y: [0, -15, 0, 0, 0, 0],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
}

const ProductGrid = ({ data, isLoading, isSuccess, isError }) => {
  return (
    <main className={classes.productGrid}>
      <AnimatePresence>
        {
          isSuccess && data.products.map(p => 
            <ProductCard key={p._id}  
              product={p}
            />)
        }
      </AnimatePresence>

      
      {/* Handle fetch states */}
      {
        isSuccess && data.products.length < 1 && 
        <h1>No products matched</h1>
      }
      {
        isLoading && 
        <motion.h1 style={{ display: 'flex', marginLeft: '3vw', marginTop: '3vh', fontSize: '3em', color: 'var(--text)' }}
          variants={headerVariants} initial='initial' animate='loading'
        >
          <motion.span variants={letterVariants}>L</motion.span>
          <motion.span variants={letterVariants}>o</motion.span>
          <motion.span variants={letterVariants}>a</motion.span>
          <motion.span variants={letterVariants}>d</motion.span>
          <motion.span variants={letterVariants}>i</motion.span>
          <motion.span variants={letterVariants}>n</motion.span>
          <motion.span variants={letterVariants}>g</motion.span>
        </motion.h1>
      }
      {
        isError && <h1>Error loading products. Please refresh browser</h1>
      }
    </main>
  )
}

export default ProductGrid;