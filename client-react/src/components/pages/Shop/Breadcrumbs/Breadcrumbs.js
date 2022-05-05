import classes from './Breadcrumbs.module.css'
import { Link } from 'react-router-dom'

const Breadcrumbs = ({ category }) => {

    return (
        <div className={classes.breadcrumbs}>
            <Link to={'/shop'} key={'all'} className={classes.link}>All</Link>
            { category && category.parent &&
                category.ancestors.map(c => 
                    <div className='fr' key={c._id}>
                        <p>/</p>
                        <Link to={`/shop/${c.slug}`} className={classes.link}>
                            {c.name}
                        </Link>
                    </div>
                )
            }
            { category && 
                <div className='fr' key={category._id}>
                    <p>/</p>
                    <Link to={`/shop/${category.slug}`} className={classes.link}>
                        {category.name}
                    </Link>
                </div>
            }
        </div>
    )
}

export default Breadcrumbs;