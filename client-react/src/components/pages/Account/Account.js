import classes from './Account.module.css'
import Page from '../../UI/Page/Page'
import ShippingAddressForm from './ShippingAddressForm/ShippingAddressForm'
import BillingAddressForm from './BillingAddressForm/BillingAddressForm'
import AccountDetailsForm from './AccountDetailsForm/AccountDetailsForm'
import MyOrders from '../Orders/MyOrders/MyOrders'
import { useEffect, useState } from 'react'
import { useNavigatem, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useGetUserQuery } from '../../../store/services/endpoints/userEndpoints'
import { logout } from '../../../store/reducers/userSlice'
import { resetCart } from '../../../store/reducers/cartSlice'
import Button from '@mui/material/Button'
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import useMediaQuery from '@mui/material/useMediaQuery'

const Account = () => {

    const breakpoint = useMediaQuery('(max-width: 900px)')

    //config state and navigation
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    
    //Query for logged in user account details
    const { data, isSuccess, isError, refetch: refetchUserDetails } = useGetUserQuery(user.userId)

    //Logout function 
    const handleLogout = () => {
        dispatch(logout())
        dispatch(resetCart())
    }

    //State and side effect to handle refetch on user update
    const [userUpdate, setUserUpdate] = useState(false)

    useEffect(() => {
        if(userUpdate){
            refetchUserDetails()
            setUserUpdate(false)
        }
    },[userUpdate])

    //State for selected tab
    const [tabValue, setTabValue] = useState(0)

    return (
        <Page className={classes.accountPage}>
            <h1 className={classes.header}>My account</h1>
            {user.isAuthenticated && isSuccess && 
                <main className={classes.main}>
                    <Tabs value={tabValue} 
                        orientation={breakpoint ? 'horizontal' : 'vertical'} 
                        onChange={(e, v) => setTabValue(v)} 
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile 
                        sx={{ width: 'fit-content', maxWidth: '90vw' }}
                    >
                        <Tab value={0} label='Account Details'/>
                        <Tab value={1} label='Shipping Address'/>
                        <Tab value={2} label='Billing Address'/>
                        <Tab value={3} label='Orders'/>
                    </Tabs>
                    { tabValue === 0 && <AccountDetailsForm userDetails={data.account} setUserUpdate={setUserUpdate}/> }
                    { tabValue === 1 && <ShippingAddressForm shippingAddress={data.shippingAddress} setUserUpdate={setUserUpdate}/> }
                    { tabValue === 2 && <BillingAddressForm billingAddress={data.billingAddress} setUserUpdate={setUserUpdate}/> }
                    { tabValue === 3 && <MyOrders showTitle={false} className={classes.myOrders}/> }
                </main>
            }
            {!user.isAuthenticated && 
                <div className={classes.message}>
                    <h3>Sign in to view your account</h3>
                    <Button onClick={() => navigate('/login', { state: { redirect: location.pathname }})} endIcon={<LoginIcon/>}>Sign in</Button>
                </div>
            }
            {user.isAuthenticated && isError &&
                <div className={classes.message}>
                    <h3>Could not load your account, try siging out and signing back in.</h3>
                    <Button onClick={handleLogout} endIcon={<LogoutIcon/>}>Sign out</Button>
                </div>
            }
        </Page>
    )
}

export default Account