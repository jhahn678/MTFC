import classes from './MyOrders.module.css'
import { useGetUserOrdersQuery } from '../../../../store/services/endpoints/userEndpoints'
import { useSelector } from 'react-redux'
import Order from '../Order/Order'
import OrderGrid from '../OrderGrid/OrderGrid'
import CircularProgress from '@mui/material/CircularProgress'

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
             { userOrdersLoading && <CircularProgress size={50}/>}
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