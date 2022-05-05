import { useState, useEffect } from 'react'
import classes from './CartItem.module.css'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import { updateItemQuantity, removeFromCart, resetCart } from '../../../../store/reducers/cartSlice'
import { useDeleteCartMutation, useRemoveItemMutation, useUpdateItemMutation } from '../../../../store/services/endpoints/cartEndpoints'
import { toast } from 'react-toastify'


const CartItem = ({ variant, quantity }) => {

    const dispatch = useDispatch()
    const cartState = useSelector((state) => state.cart)

    const [ removeItemMutation ] = useRemoveItemMutation()
    const [ deleteCartMutation ] = useDeleteCartMutation()
    const [ updateItemMutation ] = useUpdateItemMutation()


    const [quantityInput, setQuantityInput] = useState(quantity)

    useEffect(() => {
        setQuantityInput(quantity)
    }, [quantity])

    const inputChangeHandler = (e) => {
        setQuantityInput(e.target.value);
    }

    ///Every time i change quantity, server sends api call for new item with that quantity

    const handleUpdateMutations = async (cartLength, newQty) => {
        try{
            if(newQty > 0){
                await updateItemMutation({
                    cartId: cartState.id,
                    itemId: variant._id,
                    quantity: newQty
                })
            }else if(cartLength > 1){
                await removeItemMutation({
                    cartId: cartState.id,
                    itemId: variant._id,
                })
                toast.info(`${variant.product_name} ${variant.variant_type} ${variant.display_name} removed from cart`, { position: 'bottom-right'})
            }else{
                await deleteCartMutation(cartState.id)
                toast.info(`${variant.product_name} ${variant.variant_type} ${variant.display_name} removed from cart`, { position: 'bottom-right'})
                dispatch(resetCart())
            }
        }catch(err){
            console.error(err)
        }
    }


    const inputBlurHandler = () => {
        const cartLength = cartState.items.length;
        const newQty = parseInt(quantityInput);
        dispatch(updateItemQuantity({
            itemId: variant._id,
            quantity: newQty
        }))
        handleUpdateMutations(cartLength, newQty)
    }

    const quantityMinusHandler = async () => {
        const cartLength = cartState.items.length;
        const newQty = parseInt(quantityInput) - 1
        dispatch(updateItemQuantity({
            itemId: variant._id,
            quantity: newQty
        }))
        handleUpdateMutations(cartLength, newQty)
    }

    const quantityAddHandler = async () => {
        const newQty = parseInt(quantityInput) + 1;
        dispatch(updateItemQuantity({
            itemId: variant._id,
            quantity: newQty
        }))
        try{
            updateItemMutation({
                cartId: cartState.id,
                itemId: variant._id,
                quantity: newQty
            })
        }catch(err){
            console.error(err)
        }
    }

    const keyDownHandler = async (e) => {
        if(e.key == 'Enter'){
            const cartLength = cartState.items.length;
            const newQty = quantityInput;
            dispatch(updateItemQuantity({
                itemId: variant._id,
                quantity: quantityInput
            }))
            handleUpdateMutations(cartLength, newQty)
        }
    }


    const removeFromCartHandler = async () => {
        const cartLength = cartState.items.length;
        toast.info(`${variant.product_name} ${variant.variant_type} ${variant.display_name} removed from cart`, { position: 'bottom-right'})
        dispatch(removeFromCart({
            itemId: variant._id,
        }))
        try{
            if(cartLength > 1){
                const res = await removeItemMutation({
                    cartId: cartState.id,
                    itemId: variant._id,
                })
            }else{
                const res = await deleteCartMutation(cartState.id)
                dispatch(resetCart())
            }
        }catch(err){
            console.error(err)
        }
    }


    return (
        <div className={classes.cartItemContainer}>
            <h3>{variant.product_name}</h3>
            <main>
                <img className={classes.cartItemImg} src={variant.image}/>
                <p>{`${variant.variant_type}: ${variant.display_name}`}</p>
            </main>
            <footer className={classes.cardItemFooter}>
                <p className={classes.price}>{`$${(quantity * variant.price).toFixed(2)}`}</p>
                <div className={classes.cartItemQuantity}>
                    <IconButton onClick={quantityMinusHandler}><RemoveIcon/></IconButton>
                    <TextField type='number' label='Quantity' variant='outlined' size='small' className={classes.cartItemQuantityInput}
                        value={quantityInput} onChange={inputChangeHandler} onBlur={inputBlurHandler} onKeyDown={keyDownHandler}/>
                    <IconButton onClick={quantityAddHandler}><AddIcon/></IconButton>
                </div>
                <IconButton aria-label={'remove item from cart'} onClick={removeFromCartHandler}>
                    <DeleteIcon />
                </IconButton>
            </footer>
        </div>
    )
}

export default CartItem