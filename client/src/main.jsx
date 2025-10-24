import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/index.js'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />

    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: { background: '#1e3a8a', color: '#93c5fd', border: '1px solid #3b82f6', },
        success: { duration: 1500, },
        error: { duration: 3000, },
      }}
      containerStyle={{ top: '80px', }}
      reverseOrder={false}
      gutter={8}
    />

  </Provider>
)