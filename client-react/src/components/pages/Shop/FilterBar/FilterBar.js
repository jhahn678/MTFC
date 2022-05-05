import classes from './FilterBar.module.css'
import TextField from '@mui/material/TextField'
import { useDispatch, useSelector } from 'react-redux'
import MenuItem from '@mui/material/MenuItem'
import { setLimit, setSort,} from '../../../../store/reducers/shopSlice'

const FilterBar = ({ data }) => {

  const shopState = useSelector((state) => state.shop)
  const dispatch = useDispatch()

  return (
    <div className={classes.filterBar}>
        <TextField select className={classes.filterSelect}
          label='Sort' 
          value={shopState.sort} 
          onChange={e => dispatch(setSort(e.target.value))}
          variant='standard'
        >
          <MenuItem value={''}>None</MenuItem>
          <MenuItem value={'createdAt'}>Newest</MenuItem>
          <MenuItem value={'name'}>A-Z</MenuItem>
          <MenuItem value={'-name'}>Z-A</MenuItem>
          <MenuItem value={'-price'}>Price: High - Low</MenuItem>
          <MenuItem value={'price'}>Price: Low - High</MenuItem>
        </TextField> 
        <TextField select value={shopState.limit}
           label='Per page' sx={{ width: 70 }} variant='standard'
           onChange={e => dispatch(setLimit(e.target.value))}
         >
           <MenuItem value={3}>3</MenuItem>
           <MenuItem value={15}>15</MenuItem>
           <MenuItem value={30}>30</MenuItem>
           {data && <MenuItem value={data.count}>All</MenuItem>}
         </TextField>
    </div>
  )
}

export default FilterBar
