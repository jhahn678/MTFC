import { useState, useEffect } from 'react'
import { useGetAllCategoriesQuery } from '../../../../store/services/endpoints/productEndpoints'
import CategorySubTree from './CategorySubTree'
import CategoryLeaf from './CategoryLeaf'
import List from '@mui/material/List'


const CategoryTree = ({ selected }) => {

    const { data: categories, isSuccess } = useGetAllCategoriesQuery()
    const [parentNodes, setParentNodes] = useState([])

    useEffect(() => {
        if(isSuccess) setParentNodes(categories.filter(c => !c.parent))
    },[categories])

    return (
        <List sx={{ width: '20vw', marginLeft: '2vw', minHeight: '50vh'}}>
            {
                parentNodes.map(p => (
                    p.has_children ? 
                    <CategorySubTree key={p._id} category={p} categories={categories} selected={selected}/> : 
                    <CategoryLeaf key={p._id} category={p} isParent/>
                ))
            }
        </List>
    )
}

export default CategoryTree