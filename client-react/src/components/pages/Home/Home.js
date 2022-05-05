import classes from './Home.module.css'
import Hero from './Hero/Hero'
import FeaturedProducts from "./FeaturedProducts/FeaturedProducts"
import Page from '../../UI/Page/Page'
import Newsletter from '../../UI/Newsletter/Newsletter'
import LearnMore from './LearnMore/LearnMore'
import CustomOrders from "./CustomOrders/CustomOrders"


const Home = () => {
    return(
        <Page className={classes.homeContainer}>
            <Hero />
            <FeaturedProducts />
            <LearnMore />
            <CustomOrders/>
            <Newsletter />
        </Page>
    )
}

export default Home;