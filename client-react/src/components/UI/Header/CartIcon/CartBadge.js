import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge'

const CartBadge = styled(Badge)(() => ({
    '& .MuiBadge-badge': {
        top: '18px',
        right: '2px',
        border: '2px solid rgb(255, 248, 250)',
        padding: '4px'
    }
}));

export default CartBadge;