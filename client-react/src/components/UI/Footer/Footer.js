import classes from './Footer.module.css'
import Logo from '../Header/Logo/Logo'
import fishingvestsvg from '../../../assets/fishing-vest.svg'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import MapIcon from '@mui/icons-material/Map';
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import PinterestIcon from '@mui/icons-material/Pinterest';



const Footer = () => {
  return (
    <>
    <div className='divider'/>
    <footer className={classes.footer}>
        <section className={classes.footerLeft}>
            <span>
                <Logo className={classes.logo}/>
                <p className={classes.caption}>This site is meant as a demonstration of eCommerce functionality. Mountain Trout Fly Co. is not a legitimate business. Public orders are disabled and will not be fulfilled</p>
            </span>
            <p className={classes.caption}>©MTFC 2022</p>
        </section>
        <section className={classes.footerCenter}>
            <h2 className={classes.headerCenter}>Useful links</h2>
            <div className={classes.linksContainer}>
                <div>
                    <Link to='/'>Home</Link>
                    <Link to='/about'>About</Link>
                    <Link to='/blog'>Blog</Link>
                    <Link to='/'>Terms</Link>
                    <Link to='/contact'>Support</Link>
                </div>
                <div>
                    <Link to='/account'>Profile</Link>
                    <Link to='/cart'>Cart</Link>
                    <Link to='/'>Wishlist</Link>
                    <Link to='/orders'>Orders</Link>
                    <Link to='/orders'>Track order</Link>
                </div>
            </div>
        </section>
        <section className={classes.footerRight}>
            <div className={classes.contactContainer}>
                <span className={classes.heading}>
                    <h2 className={classes.headerRight}>Contact</h2>
                    <IconButton sx={{ color: '#4267B2'}}><FacebookIcon/></IconButton>
                    <IconButton sx={{ color: '#1DA1F2'}}><TwitterIcon/></IconButton>
                    <IconButton sx={{ color: '#C13584'}}><InstagramIcon/></IconButton>
                    <IconButton sx={{ color: '#c8232c'}}><PinterestIcon/></IconButton>
                </span>
                <div className={classes.contactInfo}>
                    <span><IconButton><MapIcon/></IconButton>464 Hatch Ln Harrisburg, PA 17111</span>
                    <span><IconButton><CallIcon/></IconButton>717-395-6436</span>
                    <span><IconButton><EmailIcon/></IconButton>Contact@mtfc.com</span>
                </div>
                <img className={classes.watermark} src={fishingvestsvg} alt='fishing vest svg' />
            </div>
        </section>
    </footer>
    </>
  )
}

export default Footer