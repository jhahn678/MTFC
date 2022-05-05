import { useNavigate } from 'react-router-dom'

const Logo = ({ className }) => {

  const navigate = useNavigate()

  return (
    <img 
      className={className}   
      src={'https://storage.googleapis.com/mtfc-products/MTFC-svg/MTFC-logo.png'} 
      alt={'MTFC logo'}
      onClick={() => navigate('/')}
      style={{ cursor: 'pointer' }} 
    />
  )
}

export default Logo