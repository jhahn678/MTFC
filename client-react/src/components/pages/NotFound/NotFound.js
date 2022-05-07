import { useNavigate } from 'react-router-dom'
import Page from '../../UI/Page/Page'
import classes from './NotFound.module.css'
import Button from '@mui/material/Button'


const NotFound = () => {

    const navigate = useNavigate()
    return (
        <Page className={classes.notFoundPage}>
            <h1>Page Not Found</h1>
            <Button variant='contained' onClick={() => navigate(-1)}>Take me back</Button>
        </Page>
    )
}

export default NotFound;