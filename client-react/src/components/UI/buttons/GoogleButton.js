import { styled } from '@mui/system'
import GoogleIcon from '@mui/icons-material/Google';
import Button from '@mui/material/Button'

const LoginWithGoogleButton = styled(Button)(({ theme }) => ({
    background: '#fdfdfd',
    color: 'var(--text)',
    borderTop: '1px solid var(--googleBlue)',
    borderRight: '1px solid var(--googleRed)',
    borderLeft: '1px solid var(--googleYellow)',
    borderBottom: '1px solid var(--googleGreen)',
    '&:hover': {
        background: 'whitesmoke'
    }
}))

const GoogleButton = ({ onClick, disabled, children }) => {
    return(
        <LoginWithGoogleButton 
            variant='contained' 
            startIcon={<GoogleIcon/>}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </LoginWithGoogleButton>
    )
}

export default GoogleButton;