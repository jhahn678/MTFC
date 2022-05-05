import classes from './OrderGrid.module.css'

const OrderGrid = (props) => {
  return (
    <div className={classes.orderGrid}>{props.children}</div>
  )
}

export default OrderGrid