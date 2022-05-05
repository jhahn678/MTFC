import React from 'react'
import theme from './helpers/muiThemes';
import { ThemeProvider } from '@mui/material/styles';
import { ToastContainer } from 'react-toastify'
import AppRoutes from './AppRoutes'
import Header from './components/UI/Header/Header'
import Footer from './components/UI/Footer/Footer';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <Header />
      <AppRoutes/>
      <Footer />
    </ThemeProvider>
  )
}

export default App;
