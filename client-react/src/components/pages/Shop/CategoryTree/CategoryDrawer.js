import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'

const CategoryDrawer = styled(Drawer)(() => ({
    '& .MuiDrawer-paperAnchorLeft': {
        width: '80vw',
        maxWidth: '330px',
        minWidth: '290px',
        flexShrink: 0
    },
    '& .MuiDrawer-paper': {
        fontSize: '1.2em',
        boxSizing: 'border-box'
    },
}));

export default CategoryDrawer;