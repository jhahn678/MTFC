import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton';
import { useEffect } from 'react'
import { useNavigate } from 'react-router';

const CategoryLeaf = ({ category, selected, isParent, expandParent }) => {
    
    const navigate = useNavigate()

    useEffect(() => {
        if(selected && category.slug === selected){
            expandParent()
        }
    },[selected])

    return (
        isParent ? 
        <ListItem>
            <ListItemButton onClick={() => navigate(`/shop/${category.slug}`)}>
                {category.name}
            </ListItemButton>
        </ListItem> : 
        <ListItemButton onClick={() => navigate(`/shop/${category.slug}`)}>
            {category.name}
        </ListItemButton>
    )
}

export default CategoryLeaf