import classes from './ShopByCategory.module.css'
import Page from '../../../UI/Page/Page'
import { useGetProductsByCategoryQuery } from '../../../../store/services/endpoints/productEndpoints'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import FilterBar from '../FilterBar/FilterBar'
import Pagination from '@mui/material/Pagination';
import ProductGrid from '../ProductGrid/ProductGrid'
import { useEffect, useState } from 'react'
import { useSearchParams, useLocation, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setPage } from '../../../../store/reducers/shopSlice'
import CategoryTree from '../CategoryTree/CategoryTree'
import useMediaQuery from '@mui/material/useMediaQuery'
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton'
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import Divider from '@mui/material/Divider'
import CategoryDrawer from '../CategoryTree/CategoryDrawer'

let isInitial = true;


const ShopByCategory = () => {

  const breakpoint = useMediaQuery('(max-width: 800px)')
  const [open, setOpen] = useState(false)

  //Select shopSlice from redux
  const shopState = useSelector(state => state.shop)
  const dispatch = useDispatch()
  const location = useLocation()
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    setSearchParams({ ...shopState })
  },[shopState.page, shopState.limit, shopState.sort])

  useEffect(() => {
    if(!isInitial) refetchProducts()
    isInitial = false;
  },[searchParams, slug])

  //Query for all products
  const { 
    data, 
    isSuccess, 
    isLoading, 
    isError, 
    refetch: refetchProducts 
  } = useGetProductsByCategoryQuery({ slug: slug, query: location.search })

  return(
      <Page className={classes.shopPage}>
          <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/nymp.svg' alt='nymph vector' className={classes.watermark}/>
          <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/softhackle-pheasant-tail.svg' alt='nymph vector' className={classes.watermark2}/>
          { data && <Breadcrumbs category={data.category}/>}
          <h1 className={classes.header}>{isSuccess ? `Shop ${data.category.name}` : 'Shop'}</h1>
  
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
                    <CategoryTree selected={slug} styles={{ width: '80%', marginLeft: '2vw' }}/>
                  </CategoryDrawer> :
                  <CategoryTree selected={slug}/>
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

export default ShopByCategory