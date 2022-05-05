const Cart = require('../models/cart')
const Variant = require('../models/variant')
const AppError = require('./AppError')

module.exports = validateUserShoppingCart = async (user) => {
    try{
        const cartData = await Cart.findById(user.cart)
        let modified = false;
        //map out all item ids and validate that theyre still valid.
        //In the case that items were removed from inventory.
        for(let item of cartData.items){
            const variant = await Variant.findById(item.variant)
            //if product is no longer available/valid or stock is less than quantity
            if(!variant || item.quantity > variant.stock ){
                modified = true;
                //Pull item from user cart
                const updated = await Cart.findByIdAndUpdate(cartData._id, {
                    $pull: { items: { variant: item.variant }}
                }, { new: true })
                //If that reduces cart to a length of zero, delete cart and remove from user
                if(updated.items.length < 1){
                    await updated.remove()
                    user.set('cart', null)
                    await user.save()
                    return{
                        cart: null,
                        cartModified: modified
                    }
                }
            }
        }
        //Respond with cart and let client know if items were removed
        const cart = await Cart.findById(cartData._id).populate('items.variant')
        return {
            cart: cart,
            cartModified: modified
        }
    }catch(err){
        console.log(err)
    }
}

            