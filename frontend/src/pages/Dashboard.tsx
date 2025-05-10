import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  AppBar,
  Toolbar,
  Chip,
  Card,
  CardContent,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Summarize as SummarizeIcon,
  ExitToApp as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Task } from '../types/Task';
import TaskCard from '../components/TaskCard';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string().oneOf(['low', 'medium', 'high']).required('Priority is required'),
});

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      status: 'todo',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editTask) {
          const response = await axios.put(`/api/tasks/${editTask._id}`, values);
          setTasks(tasks.map(task => task._id === editTask._id ? response.data : task));
          toast.success('Task updated successfully!');
        } else {
          const response = await axios.post('/api/tasks', values);
          setTasks([...tasks, response.data]);
          toast.success('Task created successfully!');
        }
        handleClose();
      } catch (error) {
        toast.error('Failed to save task. Please try again.');
      }
    },
  });

  const handleClickOpen = () => {
    setEditTask(null);
    formik.resetForm();
    setOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    formik.setValues({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      priority: task.priority,
      status: task.status,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTask(null);
    formik.resetForm();
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task. Please try again.');
    }
  };

  const handleGenerateSummary = async (taskId: string) => {
    try {
      const response = await axios.post(`/api/tasks/${taskId}/summarize`);
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, summary: response.data.summary } : task
      ));
      toast.success('Summary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate summary. Please try again.');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? response.data : task));
      toast.success('Task status updated successfully!');
    } catch (error) {
      toast.error('Failed to update task status. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
        setTasks(response.data.tasks);
      } catch (error) {
        toast.error('Failed to fetch tasks. Please try again.');
      }
    };
    fetchTasks();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const categorizedTasks = {
    todo: tasks.filter(task => task.status === 'todo'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    done: tasks.filter(task => task.status === 'done'),
  };

  const columnTitles = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  };

  const columnColors = {
    todo: '#fff3e0',
    'in-progress': '#e3f2fd',
    done: '#e8f5e9',
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Task Management
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">Your Tasks</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add Task
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mt: 4, mb: 4, minHeight: '70vh' }}>
          {Object.entries(categorizedTasks).map(([status, taskList]) => (
            <Box key={status} sx={{ flex: 1, minWidth: 0 }}>
              <Paper
                sx={{
                  p: 2,
                  backgroundColor: columnColors[status as keyof typeof columnColors],
                  borderRadius: 2,
                  minWidth: '300px',
                  height: '100%',
                  minHeight: '70vh',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ 
                  pb: 2, 
                  borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  {status === 'todo' && '📋'}
                  {status === 'in-progress' && '🔄'}
                  {status === 'done' && '✅'}
                  {columnTitles[status as keyof typeof columnTitles]} ({taskList.length})
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 1,
                  flex: 1,
                  ...(taskList.length === 0 && {
                    justifyContent: 'center',
                    alignItems: 'center'
                  })
                }}>
                  {taskList.length === 0 ? (
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No tasks yet
                    </Typography>
                  ) : (
                    taskList.map((task) => (
                      <Box key={task._id} sx={{ minWidth: '250px', maxWidth: '100%' }}>
                        <TaskCard
                          task={task}
                          onDelete={handleDelete}
                          onEdit={handleEdit}
                          onStatusChange={handleStatusChange}
                          onGenerateSummary={handleGenerateSummary}
                        />
                        {task.summary && (
                          <Accordion
                            sx={{
                              mt: 0.5,
                              backgroundColor: 'rgba(255, 255, 255, 0.7)',
                              '&:before': { display: 'none' },
                            }}
                          >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="body2">View Summary</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" color="text.secondary">
                                {task.summary}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </Box>
                    ))
                  )}
                </Box>
              </Paper>
            </Box>
          ))}
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editTask ? 'Edit Task' : 'New Task'}</DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="title"
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
              <TextField
                margin="normal"
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
              <DatePicker
                label="Due Date"
                value={formik.values.dueDate}
                onChange={(value) => formik.setFieldValue('dueDate', value)}
                sx={{ mt: 2, width: '100%' }}
              />
              <TextField
                margin="normal"
                fullWidth
                id="priority"
                label="Priority"
                name="priority"
                select
                value={formik.values.priority}
                onChange={formik.handleChange}
                error={formik.touched.priority && Boolean(formik.errors.priority)}
                helperText={formik.touched.priority && formik.errors.priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
              {editTask && (
                <TextField
                  margin="normal"
                  fullWidth
                  id="status"
                  label="Status"
                  name="status"
                  select
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  <MenuItem value="todo">To Do</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="done">Done</MenuItem>
                </TextField>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={() => formik.handleSubmit()} variant="contained">
              {editTask ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard; 