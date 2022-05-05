import classes from './OrderSearch.module.css'
import { useState, useEffect } from 'react'
import { useLazyGetOrderByIdQuery } from '../../../../store/services/endpoints/orderEndpoints'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/Button'
import OrderGrid from '../OrderGrid/OrderGrid'
import Order from '../Order/Order'
import SearchIcon from '@mui/icons-material/Search'
import findordersvg from  '../../../../assets/findorder.svg'

const OrderSearch = () => {

    //State for order input
    const [ orderInput, setOrderInput ] = useState('')

    //Set state on input
    const handleInput = e => setOrderInput(e.target.value)

    //Api hook for finding order by id
    const [ getOrderById, {
        originalArgs: queryArg,
        data: orderById, 
        isError: orderByIdError, 
        isSuccess: orderByIdSuccess
    }] = useLazyGetOrderByIdQuery()

    //Clear input on successful search only
    useEffect(() => {
        if(orderByIdSuccess){
            setOrderInput('')
        }
    },[orderByIdSuccess])
    
    //Fetch order on click
    const handleSearch = () => {
        getOrderById(orderInput)
    }

    return (
        <div className={classes.orderSearch}>
            <div className={classes.searchContainer}>
                <h1 className={classes.header}>Find an order:</h1>
                <TextField label='Order ID' value={orderInput} onInput={handleInput} InputProps={{
                    endAdornment: <IconButton onClick={handleSearch}><SearchIcon/></IconButton>
                }}/>
            </div>
            <OrderGrid>
                { orderByIdSuccess && <Order dismiss={() => getOrderById('')} data={orderById.order}/> }
                { orderByIdError && queryArg !== '' &&
                    <h1 className={classes.failure}>
                        <span className={classes.word}>Order </span>
                        <span className={classes.word}>not </span>
                        <span className={classes.word}>found </span>
                    </h1>
                }
            </OrderGrid>
            <img src={findordersvg} alt='Magnifying glass svg' className={classes.findOrderSvg}/>
        </div>
    )
}

export default OrderSearch