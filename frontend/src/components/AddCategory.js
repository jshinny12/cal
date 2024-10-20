import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const AddCategory = ({ onCategoryAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        tasks: []
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            const user = JSON.parse(sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : sessionStorage.getItem('user');
            if (!user) {
                setError('No user found. Please log in.');
                return;
            }

            const request = {
                '_id': user._id,
                'category': formData.name
            };

            const response = await axios.post('http://127.0.0.1:8000/add_category/', request);
            if (response.data.status === 'success') {
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                setSuccessMessage('Category added successfully!');
                setError(null);
                
                // Trigger the onCategoryAdded callback to refresh categories in TaskManager
                onCategoryAdded(response.data.user.categories);
            } else {
                setError(response.data.message);
                setSuccessMessage(null);
            }
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Category addition failed. Please try again.');
            setSuccessMessage(null);
        }
    };

    return (
        <div>
            <Typography variant="h5">Add a Category</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {successMessage && <Typography color="primary">{successMessage}</Typography>}
            <form onSubmit={addCategory}>
                <TextField
                    type="text"
                    name="name"
                    variant="outlined"
                    color="secondary"
                    label="Category Name"
                    onChange={handleChange}
                    value={formData.name}
                    fullWidth
                    required
                    sx={{ mb: 4 }}
                />
                <Button variant="outlined" color="secondary" type="submit">
                    Add Category
                </Button>
            </form>
        </div>
    );
};

export default AddCategory;
