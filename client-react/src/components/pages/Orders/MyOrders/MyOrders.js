import classes from './MyOrders.module.css'
import { useGetUserOrdersQuery } from '../../../../store/services/endpoints/userEndpoints'
import { useSelector } from 'react-redux'
import Order from '../Order/Order'
import OrderGrid from '../OrderGrid/OrderGrid'
import CircularProgress from '@mui/material/CircularProgress'
import { motion } from 'framer-motion'

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

const MyOrders = ({ className, showTitle=true }) => {

    const userId = useSelector((state) => state.user.userId)

    const { 
        data: userOrders, 
        isLoading: userOrdersLoading,
        isSuccess: userOrdersSuccess,
        isError: userOrdersError 
    } = useGetUserOrdersQuery(userId, { skip: !userId })


    return (
        <div className={`${classes.myOrders} ${className}`}>
             { showTitle && <h2>My orders</h2>}
             { userOrdersError && <h3 style={{ marginTop: '5vh', alignSelf: 'center'}}>Error loading your orders</h3>}
             { userOrdersLoading && 
                <motion.h1 style={{ display: 'flex', marginLeft: '3vw', marginTop: '5vh', fontSize: '2.5em', color: 'var(--text)' }}
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
            { userOrdersSuccess && userOrders.orders.length === 0  && <h3 style={{ marginTop: '5vh', alignSelf: 'center'}}>You have no orders yet</h3> }
            { userOrdersSuccess && userOrders.orders.length > 0 &&
                <OrderGrid>
                    { userOrders.orders.map(order => <Order key={order._id} data={order}/>) }
                </OrderGrid>
            }
        </div>
    )
}

export default MyOrders