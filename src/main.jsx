import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import DataTreeProvider from './dataTreeContext.js'
import StateContext from './stateContext.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DataTreeProvider>
        <StateContext>
            <App />
        </StateContext>
    </DataTreeProvider>
  </React.StrictMode>,
)
