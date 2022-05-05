import classes from './FeaturedProducts.module.css'
import Button from '@mui/material/Button';
import { useGetFeaturedProductsQuery } from '../../../../store/services/endpoints/productEndpoints'
import ProductSlider from '../../../UI/ProductSlider/ProductSlider'
import { useNavigate } from 'react-router';


const FeaturedProducts = () => {
    
    const { data, isSuccess, isLoading, isError } = useGetFeaturedProductsQuery()
    const navigate = useNavigate()

    return (
        <>
            <div className={'divider'}/>
            <header className={classes.heading}>
                <h1>Featured Products</h1>
                <Button sx={{ marginLeft: '1vw'}} onClick={() => navigate('/shop')} >View all products</Button> 
            </header>
            <ProductSlider sizing={classes.container}
                data={data} 
                isSuccess={isSuccess} 
                isError={isError} 
                isLoading={isLoading}/>
            <div className={'divider'}/>
        </>
    )
        
}

export default FeaturedProducts