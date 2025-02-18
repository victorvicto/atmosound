import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DataTreeProvider from './DataTreeContext.jsx'
import { StateContextProvider } from './StateContext.jsx'
import { GlobalContextProvider } from './GlobalContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalContextProvider>
    <DataTreeProvider>
        <StateContextProvider>
            <App />
        </StateContextProvider>
    </DataTreeProvider>
    </GlobalContextProvider>
  </React.StrictMode>,
)
