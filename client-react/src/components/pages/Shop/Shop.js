import classes from './Shop.module.css'
import Page from '../../UI/Page/Page'
import { useGetProductsQuery } from '../../../store/services/endpoints/productEndpoints'
import Breadcrumbs from './Breadcrumbs/Breadcrumbs'
import FilterBar from './FilterBar/FilterBar'
import Pagination from '@mui/material/Pagination';
import ProductGrid from './ProductGrid/ProductGrid'
import { useEffect } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setPage } from '../../../store/reducers/shopSlice'
import CategoryTree from './CategoryTree/CategoryTree'
import FeaturedCategories from './FeaturedCategories/FeaturedCategories'

let isInitial = true;

const Shop = () => {

  //Select shopSlice from redux
  const shopState = useSelector(state => state.shop)
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ ...shopState })
  },[shopState.page, shopState.limit, shopState.sort])

  useEffect(() => {
    if(!isInitial) refetchProducts()
    isInitial = false;
  },[searchParams])

  //Query for all products
  const { 
    data, 
    isSuccess, 
    isLoading, 
    isError, 
    refetch: refetchProducts 
  } = useGetProductsQuery(location.search)

  return(
    <Page className={classes.shopPage}>
      <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/nymp.svg' alt='nymph vector' className={classes.watermark}/>
      <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/softhackle-pheasant-tail.svg' alt='nymph vector' className={classes.watermark2}/>
      <Breadcrumbs />
      <h1 className={classes.header}>Browse All</h1>
      <FeaturedCategories/>
      <div className='frsb'>
          {isSuccess && <p style={{ alignSelf: 'center', marginLeft: '3vw', fontSize: '1.2em'}}>{data.count} results</p>}
          <FilterBar data={data}/>
      </div>

      <div className='frsb'>
          <CategoryTree/>
          <ProductGrid 
              isSuccess={isSuccess}
              isLoading={isLoading}
              isError={isError}
              data={data}
          />
      </div>

      {isSuccess && 
          <div className={classes.pagination}>
          <Pagination count={Math.ceil(data.count / shopState.limit)} 
              page={shopState.page} 
              onChange={(e, page) => dispatch(setPage(page))}
          />
          </div>
      }
    </Page>
   )
}

export default Shop;