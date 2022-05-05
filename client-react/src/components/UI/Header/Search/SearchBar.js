import { useState, useEffect } from 'react'
import { useLazySearchProductsQuery } from '../../../../store/services/endpoints/productEndpoints';
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/SearchOff'
import TextField from '@mui/material/TextField';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import SearchResult from './SearchResult/SearchResult';
import classes from './SearchBar.module.css'
import { v4 as uuid } from 'uuid'

const SearchBar = () => {

    const [searchOpen, setSearchOpen] = useState(false)
    const [input, setInput] = useState('')
    const [ searchProducts, { data: results, isLoading, isError } ] = useLazySearchProductsQuery()

    useEffect(() => {
        if(input.length >= 2){
            const timer = setTimeout(() => {
                searchProducts(input)
            },700)
            return () => {
                clearTimeout(timer)
            }
        }else{

        }
    },[input])

    return (
        <>
            <div className={classes.searchBarContainer}>
                <Collapse in={searchOpen} orientation='horizontal' unmountOnExit>
                    <Paper>
                        <TextField autoFocus
                            placeholder='Search Products'
                            value={input} 
                            onInput={e => setInput(e.target.value)}
                            sx={{ width: 350 }}
                            InputProps={{ startAdornment: 
                                <IconButton sx={{ padding: '5px', marginRight: '5px'}} onClick={() => setSearchOpen(false)}>
                                    <CancelIcon/>
                                </IconButton>
                            }}
                        />
                    </Paper>
                    { input.length >= 2 && results && results.map( item => 
                        <SearchResult key={uuid()} result={item} setSearchOpen={setSearchOpen}/>
                    )}
                    { input.length >= 2 && results && results.length === 0 &&
                        <SearchResult none/>
                    }
                    { isLoading &&
                        <SearchResult loading/>
                    }
                    { isError &&
                        <SearchResult error/>
                    }
                </Collapse>
            </div>
            <IconButton onClick={() => setSearchOpen(prev => !prev)}>
                <SearchIcon fontSize={'large'} sx={{color: 'var(--text)'}}/>
            </IconButton>
        </>
    )
}

export default SearchBar;