import React from 'react'
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Frontend/Register';
import { BrowserRouter as Router, Route, Routes, Redirect } from "react-router-dom";
import Login from './components/Frontend/Login';
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Frontend from './components/Frontend/Frontend'


function App() {

  const { user } = useSelector((state) => state.auth)
  
  // console.log(user)



  // return (
  //   <>
  //     <div className="inside">hello
  //       <div className="children">from here</div>
  //     </div>
  //   </>
  // )
  

  return (
    <>
      <Router>
      <div className="app">
        <Routes>
              <>
                
                  <Route exact path="/dashboard" element={user?<Dashboard />: <login/>} />
                  
                  <Route exact path="/" element={user?<Dashboard />:<Register />} />
                                  
                  <Route exact path="/login" element={user?<Dashboard />:<Login />} />

              </>
            
        </Routes>
        </div>

      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
