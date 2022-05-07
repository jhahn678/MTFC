import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

const CartDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paperAnchorRight': {
        width: '100vw',
        maxWidth: '450px'
    }
}));

export default CartDrawer;