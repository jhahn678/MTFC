import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState, useEffect } from 'react'
import CategoryLeaf from './CategoryLeaf';
import { useNavigate } from 'react-router';

const CategorySubTree = ({ category, categories, selected, expandParent }) => {

    const [nodes, setNodes] = useState([])
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const expandParentAndSelf = () => {
        expandParent && expandParent()
        setOpen(true)
    }

    useEffect(() => {
        if(category && category.has_children){
            setNodes(categories.filter(c => c.parent === category._id))
        }
    },[category])

    useEffect(() => {
        if(selected && category.slug === selected){
            expandParentAndSelf()
        }
    },[selected])

    return (
        <>
            <ListItem>
                <ListItemButton onClick={() => navigate(`/shop/${category.slug}`)}>{category.name}</ListItemButton>
                <IconButton onClick={() => setOpen(o => !o)}>{ open ? <ExpandLess /> : <ExpandMore /> }</IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto">
                {
                    nodes.map(node => (
                        node.has_children ?
                        <CategorySubTree key={node._id} category={node} categories={categories} selected={selected} expandParent={expandParentAndSelf}/> :
                        <CategoryLeaf key={node._id} category={node} selected={selected} expandParent={expandParentAndSelf}/>
                    ))
                }
            </Collapse>
        </>
    )
}

export default CategorySubTree;