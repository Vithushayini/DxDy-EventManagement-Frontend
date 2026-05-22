// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
// import { BrowserRouter } from 'react-router-dom';
// import App from './App.jsx';
// // import { store } from './store/index.js';
// import './styles/index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   // <React.StrictMode>
//     // <Provider store={store}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     // </Provider>
//   // </React.StrictMode> 
// );

import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, useDispatch } from 'react-redux'
import { store } from './Redux/Store/store'
import './index.css'
import AllRoutes from './routes/AllRoutes'
import { GoogleOAuthProvider } from '@react-oauth/google';
// import { getCurrentUser } from './Redux/Features/authSlice'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log('Google Client ID:', GOOGLE_CLIENT_ID);


function AppInitializer() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     dispatch(getCurrentUser());
  //   }
  // }, [dispatch]);

  return <AllRoutes />;
}

createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <StrictMode>
    <Provider store={store}>
      <AppInitializer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />
    </Provider>
  </StrictMode>
 </GoogleOAuthProvider>
);