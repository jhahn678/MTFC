import Page from '../../UI/Page/Page'
import classes from './Blog.module.css'
import { motion } from 'framer-motion'
import Button from '@mui/material/Button'

const BlogPage = () => {
  return (
    <Page className={classes.blogPage}>
      <div className={classes.container}>
          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewport={{ once: true }} className={classes.heading}>
            Learn From The Professionals
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} viewport={{ once: true }} className={classes.text}>
            Looking for insights from fly fisherman with decades of experience?
            Visit the official Mountain Trout Fly Co. blog to read the latest articles featuring
            gear reviews, tutorials, tips and tricks, opinion pieces, trip reports and much more!
          </motion.p>
          <a href='https://blog.mountaintroutflyco.com/'>
            <Button 
              variant='contained'
              size='large' 
              onClick={() => {}} 
              className={classes.button}
            >Visit the Blog</Button>
          </a>
      </div>
    </Page>
  )
}

export default BlogPage;