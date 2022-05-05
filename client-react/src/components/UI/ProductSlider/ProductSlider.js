import classes from './ProductSlider.module.css'
import { useEffect, useState } from 'react'
import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos'
import ArrowForward from '@mui/icons-material/ArrowForward'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Button, Skeleton, Divider } from '@mui/material';
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router';

const ProductSlider = ({ data, isLoading, isSuccess, isError, sizing, fixedIncrement }) => {

    const [increment, setIncrement] = useState(2)
    const [index, setIndex] = useState(0)
    const [visibleProducts, setVisibleProducts] = useState([])
    const navigate = useNavigate()

    //Once products are successfully fetched, display them in slider
    useEffect(() => {
        isSuccess && setVisibleProducts(data.slice(index, (index + increment)))
    }, [data])

    //Cart slider pagination
    useEffect(() => {
        isSuccess && 
        setVisibleProducts(() => {
            if(data.length - index < increment){
                return data.slice(index).concat(data.slice(0, (increment - (data.length - index))))
            }
            return data.slice(index, (index + increment))
        })
    }, [index])

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
                    <div className={classes.product} key={prod._id}>
                        <div className={classes.productLeft}>
                            <h2 className={classes.collapsedTitle} hidden>{prod.name}</h2>
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