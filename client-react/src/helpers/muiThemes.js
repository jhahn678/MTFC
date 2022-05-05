import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#0a3542'
        },
        secondary: {
            main: '#f4e5be'
        },
        background: {
            primary: '#fafafa'
        }
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: 'var(--background)'
                }
            }
        }
    },
    typography: {
        fontFamily: [
            'Lusitana',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    }
})

export default theme;