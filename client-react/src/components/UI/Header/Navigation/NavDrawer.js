import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

const NavDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paperAnchorLeft': {
        width: '100vw',
        maxWidth: '450px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    '& .MuiDrawer-paper': {
        fontSize: '1.2em'
    }
}));

export default NavDrawer;