import React from 'react'
import { useSelector } from 'react-redux'
import Dashboard from './components/Dashboard/Dashboard';
import Register from './components/Frontend/Register';
import { selectUser } from './features/counter/userSlice'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from './components/Frontend/Login';
// import Frontend from './components/Frontend/Frontend'



function App() {
  const user = useSelector(selectUser);

  

  return (
    <Router>
      <div className="app">
        { user ? (
          <>
            <Dashboard />
          </>
        ): (
          
          // <Frontend />
          <>
            <Route exact path="/">
              <Register />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
          </>
        )}
      </div>
    </Router>
  );
}

export default App;
