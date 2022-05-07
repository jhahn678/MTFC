import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import Home from './components/pages/Home/Home'
import Shop from './components/pages/Shop/Shop'
import ShopByCategory from './components/pages/Shop/ShopByCategory/ShopByCategory'
import Product from './components/pages/Product/Product'
import Cart from './components/pages/Cart/Cart'
import Blog from './components/pages/Blog/Blog'
import About from './components/pages/About/About'
import Contact from './components/pages/Contact/Contact'
import Orders from './components/pages/Orders/Orders'
import OrderSuccess from './components/pages/OrderComplete/OrderComplete'
import Account from './components/pages/Account/Account'
import Login from './components/pages/Login/Login'
import Register from './components/pages/Register/Register'

const AppRoutes = () => {

  const user = useSelector((state) => state.user.isAuthenticated)


  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={'app-routes'}>
          <Route exact path='/' element={<Home/>} />
          <Route exact path='/shop' element={<Shop/>}/>
          <Route path='/shop/:slug' element={<ShopByCategory/>}/>
          <Route path='/product/:slug' element={<Product/>}/>
          <Route exact path='/cart' element={<Cart/>}/>
          <Route exact path='/orders' element={<Orders/>}/>
          <Route exact path='/account' element={<Account/>}/>
          <Route exact path='/checkout/success' element={<OrderSuccess/>}/>
          <Route exact path='/blog' element={<Blog/>}/>
          <Route exact path='/about' element={<About/>}/>
          <Route exact path='/contact' element={<Contact/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/register' element={<Register/>}/>
      </Routes>
    </AnimatePresence>
  )
}

export default AppRoutes