import classes from './CartMergeModal.module.css'
import Modal from '../Modal'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../../../../store/reducers/cartSlice'
import { useMergeItemsMutation, useDeleteCartMutation } from '../../../../store/services/endpoints/cartEndpoints'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { toast } from 'react-toastify'

const itemVariants = {
    initial: { x: '-50vw' },
    animate: {
        x: 0,
        transition: {
            duration: .3,
            type: 'spring'
        }
    },
}

const CartMergeModal = ({ viewCartMerge, storedCart, setStoredCart, onDismiss }) => {

    const cartState = useSelector((state) => state.cart)
    const dispatch = useDispatch()

    const [ deleteCartMutation ] = useDeleteCartMutation()
    const [ mergeItemsMutation ] = useMergeItemsMutation()

    //Function for dismissing cart merge action.
    //On user dismiss or if there are no unique items
    const handleDismiss = () => {
        deleteCartMutation(storedCart._id)
        setStoredCart(null)
        onDismiss()
    }

    const [uniqueItems, setUniqueItems] = useState([])

    useEffect(() => {
        if (storedCart){
            //Filter items that aren't already in current cart
            const filteredItems = storedCart.items.filter(item => !cartState.items.find(i => i.variant._id === item.variant._id))
            //If there are no unique items, dismiss process
            filteredItems.length === 0 ? handleDismiss() : setUniqueItems(filteredItems)
        } 
    },[storedCart])

    const handleRemoveItem = (_id) => {
        //Remove item provided its _id
        const filteredItems = uniqueItems.filter(item => item.variant._id !== _id)
        setUniqueItems(filteredItems)
    }

    const handleSaveItems = async () => {
        // Update cart on server first. If successful, update local cart.
        const res = await mergeItemsMutation({ cartId: cartState.id, items: uniqueItems }).unwrap()
        if(res.error){
            toast.error('Something went wrong')
        }else{
            for(let uniqueItem of uniqueItems){
                dispatch(addToCart({ ...uniqueItem }))
            }
        }
        // Delete stored cart from server
        deleteCartMutation(storedCart._id)
        setStoredCart(null)
        onDismiss()
    }

    return (
    <AnimatePresence>
        {viewCartMerge &&
            <Modal className={classes.cartMergeModal} onDismiss={onDismiss}>
                <h3 className={classes.header}>Would you like to keep these from your previous cart?</h3>
                <ul className={classes.list}>
                    <AnimatePresence>
                    {
                        uniqueItems.map(item => 
                            <motion.li key={item.variant._id} className={classes.productListItem} variants={itemVariants}>
                                <IconButton onClick={() => handleRemoveItem(item.variant._id)} sx={{ alignSelf: 'center'}}><RemoveCircleOutlineIcon/></IconButton>
                                <img src={item.variant.image} alt={item.variant.product_name} className={classes.thumbnail}/>
                                <div className={classes.nameGrouping}>
                                    <h4>{item.variant.product_name}</h4>
                                    <span> 
                                        <p>{item.variant.variant_type}: {item.variant.display_name}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Total: $<b>{item.variant.price * item.quantity}</b></p>
                                    </span>
                                </div>
                            </motion.li>
                        )
                    }
                    </AnimatePresence>
                </ul>
                <footer className={classes.footer}>
                    <Button onClick={handleDismiss} >Dismiss</Button>
                    <Button onClick={handleSaveItems} variant='contained' sx={{ margin: '0 1em'}}>Save items</Button>
                </footer>
            </Modal>
        }
    </AnimatePresence>
    )
}

export default CartMergeModal