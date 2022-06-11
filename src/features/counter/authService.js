import axios from '../../components/axios'

// register user

const register = async(newUser) => {
    const response = await axios.post('/register', newUser)

    // if(response.data){
    //     // localStorage.setItem('user', JSON.stringify(response.data))
    
    // }
    console.log(response.data)

    return response.data
}


const login = async(userdetails) => {
    const response = await axios.post('/login', userdetails)

    if(response.data){
        localStorage.setItem('user', JSON.stringify(response.data))
    }

    return response.data
}

const logout = () => {
    localStorage.removeItem('user')
}


const authService = {
    register,
    login,
    logout
}

export default authService