import classes from './CartItem.module.css'
import { motion } from 'framer-motion'
import { removeFromCart, updateItemQuantity, } from '../../../../store/reducers/cartSlice'
import { useUpdateItemMutation, useRemoveItemMutation } from '../../../../store/services/endpoints/cartEndpoints'
import { useDispatch, useSelector } from 'react-redux'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'


const CartItem = ({ variant, quantity }) => {

    const dispatch = useDispatch()
    const cartState = useSelector((state) => state.cart)
    const navigate = useNavigate()

    const [ updateItemMutation ] = useUpdateItemMutation()
    const [ removeItemMutation ] = useRemoveItemMutation()

    const handleRemoveItem = () => {
        dispatch(removeFromCart({ itemId: variant._id }))
        removeItemMutation({ cartId: cartState.id, itemId: variant._id })
    }

    //Value tied to onChange
    const [ quantityInput, setQuantityInput ] = useState(quantity)
    //Value tied to onBlur -- triggers validation and cart updates
    const [ quantityValue, setQuantityValue ] = useState(quantity)

    const handleQuantityBlur = () => {
        setQuantityValue(quantityInput)
    }

    useEffect(() => {
        if(quantityValue < 1){
            dispatch(removeFromCart({ itemId: variant._id }))
            removeItemMutation({ cartId: cartState.id, itemId: variant._id })
        }else{
            dispatch(updateItemQuantity({ itemId: variant._id , quantity: quantityValue }))
            updateItemMutation({cartId: cartState.id, itemId: variant._id, quantity: quantityValue })
        }
    },[quantityValue])

    return ( 
        <motion.div className={classes.cartItem}>
            <img src={variant.image} alt={variant.product_name} className={classes.image}/>
            <section className={classes.itemDetails}>
                <h2 className={classes.itemName}>{variant.product_name}</h2>
                <p>{`${variant.variant_type} ${variant.display_name}`}</p>
                <p className={classes.detail}>Price: ${ variant.price }</p>
                <div className={classes.quantity}>
                    <p className={classes.detail}>Quantity: </p>
                    <TextField value={quantityInput} type='number' size='small' sx={{ width: '5vw', marginLeft: '1vw' }}
                        onChange={(e) => setQuantityInput(e.target.value)}
                        onBlur={handleQuantityBlur}
                    />
                </div>
                <h4 className={classes.detail}>Total: ${(variant.price * quantityValue).toFixed(2)}</h4>
                <div className={classes.buttonGroup}>
                    <Button endIcon={<DeleteOutlineIcon/>} onClick={handleRemoveItem}>Remove</Button>
                    <Button endIcon={<ArrowForwardIcon/>} onClick={() => navigate(`/product/${variant.product_slug}`)}>View</Button>
                </div>
            </section>
        </motion.div>
    )
}

export default CartItem