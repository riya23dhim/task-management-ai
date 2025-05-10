import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  AutoAwesome as AIIcon,
  Assignment as TaskIcon,
  Timeline as TimelineIcon,
  NotificationsActive as NotificationIcon,
} from '@mui/icons-material';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful!');
        navigate('/');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to login');
        toast.error('Login failed. Please check your credentials.');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Product Info Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  mb: 2,
                  fontWeight: 'bold',
                  color: '#1976d2',
                  '& span': {
                    color: '#333',
                  }
                }}
              >
                AI Task <span>Manager</span>
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                Streamline your workflow with AI-powered task management
              </Typography>

              <List sx={{ mb: 4 }}>
                <ListItem>
                  <ListItemIcon>
                    <AIIcon sx={{ color: '#1976d2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="AI-Powered Insights" 
                    secondary="Get smart summaries and suggestions for your tasks"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TaskIcon sx={{ color: '#1976d2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Intuitive Task Management" 
                    secondary="Organize tasks with drag-and-drop simplicity"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <TimelineIcon sx={{ color: '#1976d2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Visual Progress Tracking" 
                    secondary="Monitor task status with clear visual indicators"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NotificationIcon sx={{ color: '#1976d2' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Smart Notifications" 
                    secondary="Stay updated with intelligent reminders"
                  />
                </ListItem>
              </List>

              <Box sx={{ 
                p: 2, 
                bgcolor: '#e3f2fd', 
                borderRadius: 2,
                border: '1px solid #90caf9'
              }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: '#1976d2' }}>
                  "Transform your task management with AI assistance. Get started today!"
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Login Form Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={6}
              sx={{
                padding: { xs: 3, sm: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                borderRadius: 2,
                backgroundColor: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                maxWidth: '400px',
                mx: 'auto',
              }}
            >
              <Typography component="h2" variant="h5" sx={{ mb: 3, color: '#333', fontWeight: 500 }}>
                Welcome Back
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                  {error}
                </Alert>
              )}
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ mt: 1, width: '100%' }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 500,
                    textTransform: 'none',
                    borderRadius: 1.5,
                  }}
                >
                  Sign In
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link 
                    component={RouterLink} 
                    to="/register" 
                    variant="body2"
                    sx={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 