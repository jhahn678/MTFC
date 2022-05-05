import { motion } from 'framer-motion'

const Page = (props) => {

  return (
    <motion.div
      className={props.className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: .2 }}}
      style={{ marginTop: '10vh', overflow: 'hidden'}}
    >
      {props.children}
    </motion.div>
  )
}

export default Page