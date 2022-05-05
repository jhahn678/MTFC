import classes from '../SearchBar.module.css'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton';
import { useNavigate } from 'react-router-dom'

const SearchResult = ({ result, loading, error, none, setSearchOpen }) => {

    const navigate = useNavigate()
    
    const handleNavigate = () => {
        navigate(`/product/${result.slug}`)
        setSearchOpen(false)
    }

    return(
        <Paper className={classes.searchResult}>
            { result &&
                <div className='fr' onClick={handleNavigate} style={{ cursor: 'pointer'}}>
                    <img src={result.image} alt={result.name} className={classes.image}/>
                    <div className='fc' style={{ padding: '5px'}}>
                        <h4>{result.name}</h4>
                        <p>{result.description.split(' ').slice(0, 15).join(' ')}</p>
                    </div>
                </div>
            }
            { loading &&
                <div className='fr'>
                    <Skeleton animation='wave' variant='rectangular' height={90} width={100} sx={{marginTop: '5px', marginLeft: '5px'}}/>
                    <div className='fc'>
                        <Skeleton animation='wave' variant='rectangular' height={30} width={235} sx={{marginTop: '5px', marginLeft: '5px'}}/>
                        <Skeleton animation='wave' variant='rectangular' height={55} width={235} sx={{marginTop: '5px', marginLeft: '5px'}}/>
                    </div>
                </div>
            }
            { error && 
                <div className='frcc' style={{height: '100%'}}>
                    <p>Failed to load search results</p>
                </div>
            }
            { none &&
                <div className='frcc' style={{height: '100%'}}>
                    <p>No products found</p>
                </div>
            }
        </Paper>
    )
}

export default SearchResult;