import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({isLoggedIn, setIsLoggedIn}) => {
  const [formData, setFormData] = useState({
    _id: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make a POST request to the backend register API
      const response = await axios.post('http://127.0.0.1:8000/login_user/', formData);
      if (response.data.status === 'success') {
        // Registration successful, redirect to login page
        console.log(response)
        var user = JSON.stringify(response.data.user)
        sessionStorage.setItem('user', user)
        setIsLoggedIn(true)
        navigate('/')
      } else {
        // Registration failed, show error message
         
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error user login:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <React.Fragment>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <TextField
          type="text"
          name="_id"
          variant="outlined"
          color="secondary"
          label="User ID"
          onChange={handleChange}
          value={formData._id}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <TextField
          type="password"
          name="password"
          variant="outlined"
          color="secondary"
          label="Password"
          onChange={handleChange}
          value={formData.password}
          fullWidth
          required
          sx={{ mb: 4 }}
        />
        <Button variant="outlined" color="secondary" type="submit">
          Login
        </Button>
      </form>
      <small>Don't Have an Account? <a href="/register">Register Here</a></small>
    </React.Fragment>
  );
};

export default Login;
