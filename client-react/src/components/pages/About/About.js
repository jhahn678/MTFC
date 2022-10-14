import Page from '../../UI/Page/Page'
import classes from './About.module.css'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <Page className={classes.aboutPage}>
      <div className={classes.container}>
        <div className={classes.content}>
          <motion.h1 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className={classes.heading}
          >
            About
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            viewport={{ once: true }} 
            className={classes.text}
          >
            More information about the shop coming soon!
            Check out our Facbook Page in the mean time to see more
          </motion.p>
        </div>
      </div>
    </Page>
  )
}

export default About