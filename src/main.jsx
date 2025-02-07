import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DataTreeProvider from './dataTreeContext.js'
import StateContext, { StateContextProvider } from './stateContext.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataTreeProvider>
        <StateContextProvider>
            <App />
        </StateContextProvider>
    </DataTreeProvider>
  </React.StrictMode>,
)
