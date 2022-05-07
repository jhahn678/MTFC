import classes from './Shop.module.css'
import { useState } from 'react'
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
import useMediaQuery from '@mui/material/useMediaQuery'
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton'
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import Divider from '@mui/material/Divider'
import CategoryDrawer from './CategoryTree/CategoryDrawer'

let isInitial = true;

const Shop = () => {

  const breakpoint = useMediaQuery('(max-width: 800px)')
  const [open, setOpen] = useState(false)

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
          <div className='fr' style={{ marginLeft: '2vw'}}>
            { breakpoint && <IconButton onClick={() => setOpen(true)}><FilterListIcon/></IconButton>}
            { isSuccess && <p style={{ alignSelf: 'center', marginLeft: '3vw', fontSize: '1.2em'}}>{data.count} results</p>}
          </div>
          <FilterBar data={data}/>
      </div>

      <div className={breakpoint ? 'frjc': 'frsb'}>
        { breakpoint ?
            <CategoryDrawer open={open} anchor='left' onClose={() => setOpen(false)} ModalProps={{
              keepMounted: true,
            }}>
              <IconButton onClick={() => setOpen(false)} sx={{ alignSelf: 'flex-end', padding: '1vh 2vw'}}><FilterListOffIcon fontSize='large'/></IconButton>
              <Divider/>
              <CategoryTree styles={{ width: '80%', marginLeft: '2vw' }}/>
            </CategoryDrawer> :
            <CategoryTree/>
        }
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