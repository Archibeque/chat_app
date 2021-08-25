import axios from "../components/axios";
import setAuthToken from "./setAuthToken";
import jwt_decode from "jwt-decode";
import { login, logout } from '../features/counter/userSlice'
import { setErrors } from '../features/counter/errorSlice'

// import { useDispatch } from 'react-redux'




// Register User
// const dispatch = useDispatch()

export const registerUser = (userData, history) => dispatch => {
    axios
      .post("/register", userData)
      .then(res => history.push("/login")) // re-direct to login on successful register
      .catch(err =>
        dispatch(setErrors({
          errors: err.response.data
        }))
      );
    }



    // Login - get user token
export const loginUser = userData => dispatch => {
    axios
      .post("/login", userData)
      .then(res => {
        // Save to localStorage

        // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(login(decoded));
    })
    .catch(err =>
        dispatch(setErrors({
          errors: err.response.data
        }))
      );
}


// Set logged in user
// export const setCurrentUser = decoded => {
//     return {
//       type: SET_CURRENT_USER,
//       payload: decoded
//     };
    // Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
     // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(logout());
};