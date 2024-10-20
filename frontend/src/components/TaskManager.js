import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  Button,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  MenuItem,
  Select
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'; // Optional for formatting dates
import axios from 'axios';

const TaskManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [expanded, setExpanded] = useState(false); // For expanding accordions
  const [open, setOpen] = useState(false); // For opening modal
  const [selectedCategory, setSelectedCategory] = useState(''); // Track selected category for adding tasks
  const [taskFormData, setTaskFormData] = useState({
    name: '',
    due_date: null,
    do_date: null,
    time_it_takes: '',
    description: '',
    done: false,
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteCategoryName, setDeleteCategoryName] = useState('');
  const [deleteTask, setDeleteTask] = useState(null);

  // Fetch categories and tasks from sessionStorage
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user.categories) {
      setCategories(user.categories);
    }
  }, []);

  const handleAccordionChange = (categoryName) => (event, isExpanded) => {
    setExpanded(isExpanded ? categoryName : false);
  };

  // Function to handle adding a new category
  const handleAddCategory = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const request = {
        _id: user._id,
        category: newCategory,
      };
      const response = await axios.post('http://127.0.0.1:8000/add_category/', request);
      if (response.data.status === 'success') {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        setCategories(response.data.user.categories); // Update categories
        setNewCategory(''); // Clear input field
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  // Function to handle opening the modal for adding a task
  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setOpen(true);
  };

  // Handle form input changes in the modal
  const handleTaskInputChange = (e) => {
    setTaskFormData({
      ...taskFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle task submission from the modal
  const handleAddTask = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const request = {
        _id: user._id,
        category: selectedCategory, // Add task to the selected category
        ...taskFormData,
      };

      const response = await axios.post('http://127.0.0.1:8000/add_task/', request);
      if (response.data.status === 'success') {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        setCategories(response.data.user.categories); // Update categories with the new task
        setOpen(false); // Close the modal
        setTaskFormData({
          name: '',
          due_date: null,
          do_date: null,
          time_it_takes: '',
          description: '',
          done: false,
        }); // Clear form data
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  // Handle DatePicker changes
  const handleDateChange = (field, date) => {
    setTaskFormData({
      ...taskFormData,
      [field]: date ? dayjs(date).format('YYYY-MM-DD') : null,
    });
  };

  // Delete category
  const handleDeleteCategory = async (categoryName) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const request = { _id: user._id, category: categoryName };
      const response = await axios.post('http://127.0.0.1:8000/delete_category/', request);
      if (response.data.status === 'success') {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        setCategories(response.data.user.categories);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Confirm delete category
  const handleConfirmDeleteCategory = (categoryName) => {
    setDeleteCategoryName(categoryName);
    setDeleteConfirmOpen(true);
  };

  // Handle delete task
  const handleDeleteTask = async (categoryName, taskName) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const request = {
        _id: user._id,
        category: categoryName,
        task_name: taskName,
      };
      const response = await axios.post('http://127.0.0.1:8000/delete_task/', request);
      if (response.data.status === 'success') {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        setCategories(response.data.user.categories);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Box sx={{ width: '60%', margin: '0 auto', marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>

      {/* Add Category Input */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Add New Category"
          variant="outlined"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          fullWidth
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Box>

      {/* Category Accordion with Tasks */}
      {categories.map((category, index) => (
        <Accordion
          key={index}
          expanded={expanded === category.name}
          onChange={handleAccordionChange(category.name)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{category.name}</Typography>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleConfirmDeleteCategory(category.name)}
              sx={{ marginLeft: 'auto' }}
            >
              <DeleteIcon />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            {/* Task List */}
            <List>
              {category.tasks.map((task, taskIndex) => (
                <ListItem key={taskIndex} secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(category.name, task.name)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <Checkbox checked={task.done} />
                  <ListItemText
                    primary={task.name}
                    secondary={`Due: ${task.due_date}, Do: ${task.do_date}, Time: ${task.time_it_takes}, Description: ${task.description}`}
                  />
                </ListItem>
              ))}
            </List>

            {/* Add Task Button */}
            <IconButton onClick={() => handleOpenModal(category.name)}>
              <AddIcon />
            </IconButton>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Modal for Adding a Task */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Task to {selectedCategory}</DialogTitle>
        <DialogContent>
          <TextField
            type="text"
            name="name"
            variant="outlined"
            label="Task Name"
            onChange={handleTaskInputChange}
            value={taskFormData.name}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <DatePicker
            label="Due Date"
            value={taskFormData.due_date ? dayjs(taskFormData.due_date) : null}
            onChange={(date) => handleDateChange('due_date', date)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 4 }} />}
          />
          <DatePicker
            label="Do Date"
            value={taskFormData.do_date ? dayjs(taskFormData.do_date) : null}
            onChange={(date) => handleDateChange('do_date', date)}
            renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 4 }} />}
          />
          <TextField
            type="text"
            name="time_it_takes"
            variant="outlined"
            label="Time It Takes"
            onChange={handleTaskInputChange}
            value={taskFormData.time_it_takes}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
          <TextField
            type="text"
            name="description"
            variant="outlined"
            label="Description"
            onChange={handleTaskInputChange}
            value={taskFormData.description}
            fullWidth
            required
            sx={{ mb: 4 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTask} variant="contained">
            Add Task
          </Button>
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Category Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the category "{deleteCategoryName}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDeleteCategory(deleteCategoryName)} color="primary">
            Confirm
          </Button>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManager;
