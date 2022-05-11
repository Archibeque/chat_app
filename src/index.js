import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { store } from './app/store';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
// import {  Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'


// const alertOptions = {
//   timeout : 3000,
//   position : 'top center'
// }


ReactDOM.render(
  <React.StrictMode>

     <Provider store={store}>
       {/* <AlertProvider template={AlertTemplate} {...alertOptions}> */}
        <App />
      {/* </AlertProvider> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log());
