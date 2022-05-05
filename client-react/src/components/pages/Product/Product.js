import { useState, useEffect } from 'react'
import Page from '../../UI/Page/Page'
import classes from './Product.module.css'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Skeleton from '@mui/material/Skeleton'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, setCartId } from '../../../store/reducers/cartSlice'
import { useGetProductQuery, useGetSimilarProductsQuery } from '../../../store/services/endpoints/productEndpoints'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {v4 as uuid} from 'uuid'
import { toast } from 'react-toastify'
import { useAddItemMutation, useNewCartMutation } from '../../../store/services/endpoints/cartEndpoints'
import Breadcrumbs from '../Shop/Breadcrumbs/Breadcrumbs'
import ProductSlider from '../../UI/ProductSlider/ProductSlider'

const Product = () => {

  const { slug } = useParams()

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const cartState = useSelector((state) => state.cart)
  const userId = useSelector(state => state.user.userId)

  const { data: product, isLoading, isSuccess, isError } = useGetProductQuery(slug)
  const { data: similarProducts, isLoading: spIsLoading, isSuccess: spIsSuccess, isError: spIsError } = useGetSimilarProductsQuery(slug)

  const [quantity, setQuantity] = useState(1)
  const [price, setPrice] = useState('')
  const [quantityInStock, setQuantityInStock] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [selectedVariant, setSelectedVariant] = useState({})

  useEffect(() => {
    if(product){
      if(product.price.min_price === product.price.max_price) setPrice(`$${product.price.min_price}`)
      if(product.price.min_price !== product.price.max_price) setPrice(`$${product.price.min_price} - $${product.price.max_price}`)
      if(product.variants.length === 1) setSelectedVariantId(product.variants[0]._id)
    }
  },[product])

  useEffect(() => {
    if(selectedVariantId){
      const variant = product.variants.find(v => v._id === selectedVariantId)
      setSelectedVariant(variant)
      setPrice(`$${variant.price}`)
      setQuantityInStock(variant.stock)
    }
  },[selectedVariantId])


  const [addToCartMutation ] = useAddItemMutation();
  const [newCartMutation ] = useNewCartMutation();


  const handleQuantityInput = (e) => {
    const int = parseInt(e.target.value)
    if(int) setQuantity(int)
    if(!int) setQuantity('')
  }

  const handleQuantityBlur = () => {
    setQuantity((qty) => {
      qty < 1 ? setQuantity(1) : setQuantity(qty)
    })
  }
  
  const handleQuantityPlus = () => {
    setQuantity(qty => qty + 1)
  }

  const handleQuantityMinus = () => {
    setQuantity(qty => qty > 1 ? qty - 1 : qty)
  }
  
  const addToCartHandler = async () => {
    toast.success(`${product.name} added to cart`, { position: 'bottom-right' })
    dispatch(addToCart({
      variant: selectedVariant,
      quantity: quantity,
    }))

    try {
      if(!cartState.id){
        //New cart will also need userId if it exists
        const res = await newCartMutation({ userId, itemId: selectedVariantId, quantity }).unwrap()
        dispatch(setCartId({ cartId: res._id}))
      }else{
        addToCartMutation({ cartId: cartState.id, itemId: selectedVariantId, quantity })
      }
    } catch (error) {
      console.error('rejected', error);
    }
  }

  return (
    <Page>
      {isSuccess &&
        <main className={classes.productContainer}>
          <section>
            <Breadcrumbs category={product.category}/>
            <img src={product.images[0]} alt={product.name} className={classes.productImage}/>
          </section>

          <section className={classes.right}>
            <div className={classes.productNameGroup}>
              <h1 className={classes.productName}>{product.name}</h1>
              <div className='fr'>
                <Link to={`/shop/${product.category.slug}`}>
                  <motion.div whileHover={{ scale: 1.1}}>
                    <Chip size='large' label={product.category.name} 
                      slug={product.category.slug} sx={{ cursor: 'pointer' }}
                    />
                  </motion.div>
                </Link>
              {
                product.category.ancestors.length > 0 && product.category.ancestors.map(a => (
                  <Link to={`/shop/${a.slug}`} style={{ marginLeft: '.5em' }} key={uuid()}>
                    <motion.div whileHover={{ scale: 1.1}}>
                      <Chip size='large' label={a.name} slug={a.slug} sx={{ cursor: 'pointer' }}/>
                    </motion.div>
                  </Link>
                ))
              }
              </div>
              <p className={classes.productDescription}>{product.description}</p>
            </div>

            <div className={classes.optionsGroup}>
              { product.variants.length === 1 && 
                  <TextField select disabled value={selectedVariantId}
                    label={product.variant_types.join('/')}
                    onChange={e => setSelectedVariantId(e.target.value)}
                  >
                    <MenuItem value={product.variants[0]._id}>
                      {product.variants[0].display_name}{product.variants[0].stock < 1 && <i>     (Out of stock)</i>}
                    </MenuItem>
                  </TextField>
              }
              { product.variants.length > 1 &&
                  <TextField select required
                    className={classes.optionInput} value={selectedVariantId}
                    label={product.variant_types.join('/')}
                    onChange={e => setSelectedVariantId(e.target.value)}
                  >
                    {
                      product.variants.map(v => 
                        <MenuItem key={v._id} value={v._id}>
                          {v.display_name}{v.stock < 1 && <i>     (Out of stock)</i>}
                        </MenuItem>
                      )
                    }
                  </TextField>
              }
              { quantityInStock &&  <p className={classes.note}>{`In stock: ${quantityInStock}`}</p> }
            </div>

            <div className={classes.priceGroup}>
                {<p className={classes.price}>{price}</p>}
            </div>
            
            <div className={classes.cartGrouping}>
              <div className={classes.quantityGroup}>
                <IconButton onClick={handleQuantityMinus}><RemoveIcon/></IconButton>
                <TextField className={classes.quantityInput} variant='outlined' label='Quantity' 
                  value={quantity} onInput={handleQuantityInput} onBlur={handleQuantityBlur}
                  error={ Number.isInteger(quantityInStock) && (quantity > quantityInStock)}
                />
                <IconButton onClick={handleQuantityPlus}><AddIcon/></IconButton>
              </div>
              <Button variant='contained' size='large' 
                className={classes.addToCart} onClick={addToCartHandler}
                disabled={!selectedVariant || (quantity > quantityInStock)}
              >Add to cart</Button>
            </div>
            
            <Accordion sx={{ marginTop: '5vh', width: '80%'}}>
              <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon style={{transform: 'rotate(90deg)'}}/>}>Shipping Information</AccordionSummary>
              <AccordionDetails>
                Shipping is currently available in all 50 states of the United States, 
                international shipping is not available, at this time. Our orders are shipped through 
                the USPS with priority shipping. A flat rate of $7.99 applies to all orders.
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ marginTop: '1vh', width: '80%'}}>
              <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon style={{transform: 'rotate(90deg)'}}/>}>Discounts</AccordionSummary>
              <AccordionDetails>
                There are no discounts currently available for this product.
              </AccordionDetails>
            </Accordion>

            <Accordion sx={{ marginTop: '1vh', width: '80%'}}>
              <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon style={{transform: 'rotate(90deg)'}}/>}>Quality Guarentee</AccordionSummary>
              <AccordionDetails>
                Mountain Trout Fly Co. believes strongly in the quality of the products we sell. We offer
                all customers a season-long guarentee on equipment purchased from us. If a problem arises 
                within 365 days of purchase, contact us <Link to='/contact' className={classes.link}>here</Link>, 
                and we'll set you up with some replacements.
              </AccordionDetails>
            </Accordion>
          </section>
        </main>
      }
      {isLoading && 
        <main className={classes.productContainer}>
          <Skeleton className={classes.imageSkeleton}/>
          <section className={classes.right}>
            <Skeleton height='13vh' className={classes.contentSkeleton}/>
            <Skeleton height='30vh' className={classes.contentSkeleton}/>
            <Skeleton height='12vh' className={classes.contentSkeleton}/>
            <Skeleton height='15vh' className={classes.contentSkeleton}/>
          </section>
        </main>
      }
      {isError &&
        <main className={classes.failureContainer}>
          <h1 className={classes.failure}>
            <span className={classes.word}>Failed </span>
            <span className={classes.word}>to </span>
            <span className={classes.word}>load </span>
            <span className={classes.word}>product</span>
          </h1>
          <Button 
            sx={{ marginLeft: '3vw', marginTop: '10vh'}}
            startIcon={<ArrowBackIcon/>}
            onClick={() => navigate('/shop')}
          >Back to shop
          </Button>
        </main>

      }
      <section className={classes.similarProducts}>
        <div className={'divider'}/>
        <h1 className={classes.similarProductsHeader}>Similar Products</h1>
        <ProductSlider className={classes.productSlider}
          data={similarProducts} 
          isLoading={spIsLoading} 
          isSuccess={spIsSuccess} 
          isError={spIsError}/>
      </section>
    </Page>
  )
}

export default Product