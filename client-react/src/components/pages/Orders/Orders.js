import classes from './Orders.module.css'
import Page from '../../UI/Page/Page'
import MyOrders from "./MyOrders/MyOrders"
import OrderSearch from "./OrderSearch/OrderSearch"
import Button from '@mui/material/Button'
import Login from '@mui/icons-material/Login'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router'

const Orders = () => {

    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <Page className={classes.ordersPage}>
            <OrderSearch/>
            { user.isAuthenticated && <MyOrders className={classes.myOrders}/> }
            { !user.isAuthenticated && 
                <div className={classes.singIn}>
                    <h2>Have an account? Sign in to view your orders.</h2>
                    <Button endIcon={<Login/>} onClick={() => navigate('/login', { state: { redirect: location.pathname }})} >Sign in</Button>
                </div>
            } 
            
        </Page>
    )
}

export default Orders