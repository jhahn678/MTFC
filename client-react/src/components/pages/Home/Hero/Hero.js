import classes from './Hero.module.css'
import HeroText from './HeroText/HeroText'
import ScrollButton from './ScrollButton/ScrollButton'

const Hero = () => {
  return (
    <div className={classes.hero}>
      <HeroText/>
      <ScrollButton/>
    </div>
  )
}

export default Hero