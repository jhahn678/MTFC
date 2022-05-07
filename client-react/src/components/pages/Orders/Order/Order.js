import classes from './Order.module.css'
import { useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Cancel'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AnimatePresence, motion } from 'framer-motion'

const Order = ({ data, dismiss }) => {

    //State for formatted date
    const [date, setDate] = useState(null)

    //On load format date to human readable
    useEffect(() => {
        const createdAt = new Date(Date.parse(data.createdAt))
        const reformatted = createdAt.toLocaleString()
        setDate(reformatted)
    },[])

    return (
        <AnimatePresence>
        {data &&     
            <motion.div className={classes.order}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <div>
                    <h2 className={classes.title}>Order details {dismiss && <IconButton onClick={() => dismiss()}><DeleteIcon/></IconButton>}</h2>
                    <div className={classes.header}>
                        <p>Status: <b>{data.status}</b></p>
                        <p>ID: {data._id}</p> 
                        <p>{date}</p>
                    </div>
                    <div className={classes.items}>
                        {
                            data.products.map(item => 
                                <div className={classes.item} key={item._id}>
                                    <p>{item.name}</p>
                                    <p style={{ fontSize: '.9em'}}>{item.description}</p>
                                    <img src={item.image} alt={item.name} className={classes.itemImage}/>
                                    <div className={classes.details}>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Unit price: ${item.unit_price / 100}</p>
                                        <p>Total price: ${item.total_price / 100}</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={classes.footer}>
                    <div className={classes.footerItem}>
                        <h4 className={classes.footerItemHeader}>Customer Info</h4>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>{data.customer.name}</AccordionSummary>
                            <AccordionDetails>
                                <p>Email: {data.customer.email}</p>
                                <p>Phone: {data.customer.phone ? data.customer.phone : <i>Not given</i>}</p>
                                <p style={{ marginTop: 10}}>Billing address: </p>
                                <p>{data.customer.address.line1}</p>
                                <p>{data.customer.address.line2}</p>
                                <p>{`${data.customer.address.city}, ${data.customer.address.state} ${data.customer.address.postal_code}`}</p>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                    <div className={classes.footerItem}>
                        <h4 className={classes.footerItemHeader}>Shipping Info</h4>
                            {data.shipping.method && 
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon/>}>{data.shipping.method}</AccordionSummary>
                                    <AccordionDetails>
                                        <p>{data.shipping.name}</p>
                                        <p>{data.shipping.address.line1}</p>
                                        <p>{`${data.shipping.address.city}, ${data.shipping.address.state} ${data.shipping.address.postal_code}` }</p>
                                    </AccordionDetails>
                                </Accordion>
                            }
                    </div>
                    <div className={classes.footerItem}>
                        <h4 className={classes.footerItemHeader}>Payment Info</h4>
                        <span>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                    <b>Total: ${((data.total.amount_total)/100).toFixed(2)}</b>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <p>Subtotal: ${((data.total.amount_subtotal)/100).toFixed(2)}</p>
                                    <p>Discount: ${((data.total.amount_discount)/100).toFixed(2)}</p>
                                    <p>Shipping: ${((data.total.amount_shipping)/100).toFixed(2)}</p>
                                    <p>Tax: ${((data.total.amount_tax)/100).toFixed(2)}</p>
                                </AccordionDetails>
                            </Accordion>
                        </span>
                    </div>
                </div>
            </motion.div>
        }
        </AnimatePresence>
    )
}

export default Order