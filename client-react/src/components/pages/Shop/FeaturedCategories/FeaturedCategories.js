import classes from './FeaturedCategories.module.css'
import { useGetFeaturedCategoriesQuery } from '../../../../store/services/endpoints/productEndpoints'
import FeaturedCategory from './FeaturedCategory/FeaturedCategory'

const FeaturedCategories = () => {

    const { data, isSuccess } = useGetFeaturedCategoriesQuery()

    return (
    <div className={classes.categoryShortcuts}>
        {
            isSuccess && data.map(category => 
                <FeaturedCategory key={category._id} category={category}/>
            )
        }
    </div>
    )
}

export default FeaturedCategories