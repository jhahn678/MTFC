import classes from './CartList.module.css'

const CartList = (props) => {
  return (
    <div className={classes.cartList}>{props.children}</div>
  )
}

export default CartList