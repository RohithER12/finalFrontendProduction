import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store/store.js'


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>       
        <BrowserRouter>
        <main className=" dark text-foreground bg-[#121e33]">
          <App />
          <ToastContainer/>
        </main>
        </BrowserRouter>
    </React.StrictMode>
  </Provider>
)
