import classes from './ProductGrid.module.css'
import ProductCard from '../ProductCard/ProductCard'
import { motion, AnimatePresence } from 'framer-motion'

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
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1}}>No products matched</motion.h1>
      }
      {
        isLoading && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1}}>Loading</motion.h1>
      }
      {
        isError && <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1}}>Error</motion.h1>
      }
    </main>
  )
}

export default ProductGrid;