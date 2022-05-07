import classes from './ProductSlider.module.css'
import { useEffect, useState } from 'react'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import ArrowForward from '@mui/icons-material/ArrowForward'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'
import Divider from '@mui/material/Divider'
import useMediaQuery from '@mui/material/useMediaQuery'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router';

const ProductSlider = ({ data, isLoading, isSuccess, isError, sizing }) => {

    const breakpointTablet = useMediaQuery('(max-width: 800px)')
    const breakpointMobile = useMediaQuery('(max-width: 480px)')
    const [increment, setIncrement] = useState(2)
    const [index, setIndex] = useState(0)
    const [visibleProducts, setVisibleProducts] = useState([])
    const navigate = useNavigate()

    //Once products are successfully fetched, display them in slider
    useEffect(() => {
        isSuccess && setVisibleProducts(data.slice(index, (index + increment)))
    }, [data])

    useEffect(() => {
        breakpointTablet ? setIncrement(1) : setIncrement(2)
    }, [breakpointTablet])

    //Cart slider pagination
    useEffect(() => {
        isSuccess && 
        setVisibleProducts(() => {
            if(data.length - index < increment){
                return data.slice(index).concat(data.slice(0, (increment - (data.length - index))))
            }
            return data.slice(index, (index + increment))
        })
    }, [index, increment])

    //Next page
    const nextHandler = () => {
        setIndex((i) => {
            if(i + increment >= data.length){
                return (i + increment - data.length)
            }
            return i + increment
        })
    }

    //Last page
    const prevHandler = () => {
        setIndex((i) => {
            if(i - increment < 0){
                return (i - increment + data.length)
            }
            return i - increment
        })
    }


    return (
        <main className={`${classes.container} ${sizing}`}>
            <motion.div className={classes.prevButton}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: .8 }}
                onTap={isSuccess && prevHandler}
            >
                <IconButton disabled={!isSuccess}>
                    <ArrowBackIosNew/>
                </IconButton>
            </motion.div>
            <motion.div className={classes.carousel}>
                {isLoading && 
                    <>
                    <Skeleton variant='rectangular' animation='wave' height='100%' width='47%' style={{ marginRight: '5%' }}/>
                    <Skeleton variant='rectangular' animation='wave' height='100%' width='47%' />
                    </>
                }
                {isError && 
                    <h1 className={classes.failure}>
                        <span className={classes.word}>Failed </span>
                        <span className={classes.word}>to </span>
                        <span className={classes.word}>load </span>
                        <span className={classes.word}>products</span>
                    </h1>
                }
                {isSuccess && visibleProducts.length > 0 && visibleProducts.map(prod => 
                    <div className={classes.product} key={prod._id} onClick={() => navigate(`/product/${prod.slug}`)}>
                        {
                            breakpointMobile ? 
                            <>
                                <h2 className={classes.titleCollapsed}>{prod.name}</h2>
                                <img src={prod.image} alt={prod.name} className={classes.image}/>
                                <div className={classes.priceGroupCollapsed}>
                                    <p>{prod.price.min_price === prod.price.max_price ? `$${prod.price.min_price}` : `$${prod.price.min_price} - $${prod.price.max_price}`}</p>
                                    <Button endIcon={<ArrowForward/>} onClick={() => navigate(`/product/${prod.slug}`)}>View</Button>
                                </div>
                            </> : 
                            <>
                                <div className={classes.productLeft}>
                                    <img src={prod.image} alt='product'/>
                                </div>
                                <div className={classes.productRight}>
                                    <div className={classes.titleGroup}>
                                        <h2 className={classes.title}>{prod.name}</h2>
                                        <Divider style={{margin: '1vh 0'}}/>
                                        {
                                            prod.description.split(' ').length > 25 ? 
                                            <p className='fc'>{prod.description.split(' ').slice(0, 25).join(' ')} 
                                                <MoreHorizIcon onClick={() => navigate(`/product/${prod.slug}`)} sx={{ cursor: 'pointer'}}/>
                                            </p> :
                                            <p>{prod.description}</p>
                                        }
                                    </div>
                                    <div className={classes.priceGroup}>
                                        <p>{prod.price.min_price === prod.price.max_price ? `$${prod.price.min_price}` : `$${prod.price.min_price} - $${prod.price.max_price}`}</p>
                                        <Button endIcon={<ArrowForward/>} onClick={() => navigate(`/product/${prod.slug}`)}>View</Button>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                )}
            </motion.div>

            <motion.div className={classes.nextButton}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: .8 }}
                onTap={isSuccess && nextHandler}
            >
                <IconButton disabled={!isSuccess}>
                    <ArrowForwardIos/>
                </IconButton>
            </motion.div>
        </main>
    )
}

export default ProductSlider