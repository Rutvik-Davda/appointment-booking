import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <DataProvider>
          <AuthProvider>
            <App />
            <ToastContainer
              position="top-right"
              autoClose={2500}
              theme="colored"
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </AuthProvider>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
