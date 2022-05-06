import IconButton from '@mui/material/IconButton'
import SearchIconMui from '@mui/icons-material/Search';
import SearchBar from '../SearchBar/SearchBar'
import { useState } from 'react'
import classes from '../SearchBar/SearchBar.module.css'

const SearchIcon = () => {

    const [open, setOpen] = useState(false)

    return (
        <>
        <IconButton onClick={() => setOpen(prev => !prev)}>
            <SearchIconMui fontSize={'large'} sx={{color: 'var(--text)'}}/>
        </IconButton>
        <SearchBar containerStyle={classes.searchBarContainer} open={open} setOpen={setOpen}/>
        </>
    )
}

export default SearchIcon