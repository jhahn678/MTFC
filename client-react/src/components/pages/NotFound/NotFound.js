import { useNavigate } from 'react-router-dom'
import Page from '../../UI/Page/Page'
import classes from './NotFound.module.css'
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


const NotFound = () => {

    const navigate = useNavigate()
    return (
        <Page className={classes.notFoundPage}>
            <img src='https://storage.googleapis.com/mtfc-products/MTFC-svg/mountains-and-trees.png'
                alt='mountains and trees vector'
                className={classes.image}
            />
            <div className={classes.container}>
                <h1 className={classes.header}>Page Not Found</h1>
                <Button variant='outlined'
                    startIcon={<ArrowBackIcon/>} 
                    onClick={() => navigate(-1)} 
                    sx={{ fontSize: '1em', minWidth: '100%'}}
                >Take me back</Button>
            </div>
        </Page>
    )
}

export default NotFound;