import React from 'react';
import { createRoot } from 'react-dom/client'
import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { store } from './store/store'


const container = document.getElementById('root')
const root = createRoot(container)
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <StyledEngineProvider injectFirst>
                <App />
            </StyledEngineProvider>
        </BrowserRouter>
    </Provider>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
