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

    const [uniqueItems, setUniqueItems] = useState([])
    useEffect(() => {
        if (storedCart){
            //Convert items from stored cart
            const items = storedCart.items.map(item => {
                return{
                    id: item.itemId._id,
                    itemName: item.itemId.itemName,
                    unitPrice: item.itemId.unitPrice,
                    image: item.itemId.image,
                    quantity: item.quantity,
                    options: item.options
                }
            })
            //Filter items that arent already in current cart
            const filteredItems = items.filter(item => cartState.items.find(
                //Where id is unique OR id is not unique but options are not the same
                i => i.id !== item.id || (i.id === item.id &&  i.options.join('') !== item.options.join('')))
            )
            setUniqueItems(filteredItems)
        } 
    },[storedCart])

    const handleRemoveItem = (itemId, options) => {
        //Remove item provided its itemId and options
        const filteredItems = uniqueItems.filter(item => item.id !== itemId || (item.id === itemId && item.options.join('') !== options.join('')))
        setUniqueItems(filteredItems)
    }

    const handleDismiss = () => {
        // If user dismisses cart merge, just delete the cart from the server
        deleteCartMutation(storedCart._id)
        setStoredCart(null)
        onDismiss()
    }

    const handleSaveItems = async () => {
        // Update cart on server first. If successful, update local cart.
        const res = await mergeItemsMutation({ cartId: cartState.cartId, items: uniqueItems }).unwrap()
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
                            <motion.li key={item.id} className={classes.productListItem} variants={itemVariants}>
                                <IconButton onClick={() => handleRemoveItem(item.id, item.options)} sx={{ alignSelf: 'center'}}><RemoveCircleOutlineIcon/></IconButton>
                                <img src={item.image} alt={item.itemName} className={classes.thumbnail}/>
                                <div className={classes.nameGrouping}>
                                    <h4>{item.itemName}</h4>
                                    <span> 
                                        {item.options.length > 0 && <p>Options: {item.options}</p>}
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Total: $<b>{item.unitPrice * item.quantity}</b></p>
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