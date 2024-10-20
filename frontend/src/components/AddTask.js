import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';

const AddTask = ({ selectedCategory, onTaskAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    due_date: '',
    do_date: '',
    time_it_takes: '',
    description: '',
    done: false,
  });
  const [open, setOpen] = useState(false); // Modal open state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const request = {
        _id: user._id,
        category: selectedCategory, // Add task to the selected category
        ...formData,
      };

      const response = await axios.post('http://127.0.0.1:8000/add_task/', request);
      if (response.data.status === 'success') {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        onTaskAdded(response.data.user.categories);
        setOpen(false); // Close modal after task is added
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <AddIcon />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Task to {selectedCategory}</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="name"
            variant="outlined"
            color="secondary"
            label="Task Name"
            onChange={handleChange}
            value={formData.name}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            name="due_date"
            variant="outlined"
            color="secondary"
            label="Due Date"
            onChange={handleChange}
            value={formData.due_date}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            name="do_date"
            variant="outlined"
            color="secondary"
            label="Do Date"
            onChange={handleChange}
            value={formData.do_date}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            name="time_it_takes"
            variant="outlined"
            color="secondary"
            label="Time It Takes"
            onChange={handleChange}
            value={formData.time_it_takes}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            name="description"
            variant="outlined"
            color="secondary"
            label="Description"
            onChange={handleChange}
            value={formData.description}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={addTask} variant="contained">
            Add Task
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddTask;
