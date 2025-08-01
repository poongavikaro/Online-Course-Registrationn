import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  School,
  BookmarkBorder,
  TrendingUp,
  Schedule,
  Person,
  Email,
  Phone,
  LocationOn,
  Edit,
  Close,
} from '@mui/icons-material';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 0,
    activeCourses: 0,
    completedCourses: 0,
    enrolledCourses: [],
    student: null
  });
  const [loading, setLoading] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/students/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDropCourse = async (courseId) => {
    try {
      await axios.delete(`/api/students/enroll/${courseId}`);
      toast.success('Course dropped successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Error dropping course:', error);
      toast.error('Failed to drop course');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enrolled': return 'primary';
      case 'in-progress': return 'warning';
      case 'completed': return 'success';
      case 'dropped': return 'error';
      default: return 'default';
    }
  };

  const stats = [
    {
      title: 'Total Courses',
      value: dashboardData.totalCourses,
      icon: <School />,
      color: 'primary.main'
    },
    {
      title: 'Active Courses',
      value: dashboardData.activeCourses,
      icon: <BookmarkBorder />,
      color: 'success.main'
    },
    {
      title: 'Completed',
      value: dashboardData.completedCourses,
      icon: <TrendingUp />,
      color: 'info.main'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Continue your learning journey and explore new courses
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
              <Avatar
                src={user?.avatar}
                sx={{ width: 80, height: 80, cursor: 'pointer' }}
                onClick={() => setProfileOpen(true)}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card className="card-hover">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.8 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                My Courses
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/courses')}
                startIcon={<School />}
              >
                Browse Courses
              </Button>
            </Box>

            {dashboardData.enrolledCourses.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No courses enrolled yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Start your learning journey by browsing our course catalog
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/courses')}
                  size="large"
                >
                  Explore Courses
                </Button>
              </Box>
            ) : (
              <List>
                {dashboardData.enrolledCourses.map((enrollment, index) => (
                  <ListItem 
                    key={index}
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider', 
                      borderRadius: 2, 
                      mb: 2,
                      '&:hover': { bgcolor: 'grey.50' }
                    }}
                  >
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {enrollment.courseId?.title || 'Course Title'}
                          </Typography>
                          <Chip 
                            label={enrollment.status} 
                            size="small" 
                            color={getStatusColor(enrollment.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {enrollment.courseId?.courseCode} • {enrollment.courseId?.department} • {enrollment.courseId?.credits} Credits
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Enrolled: {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/courses/${enrollment.courseId?._id}`)}
                      >
                        View
                      </Button>
                      {enrollment.status === 'enrolled' && (
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDropCourse(enrollment.courseId?._id)}
                        >
                          Drop
                        </Button>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Quick Actions & Profile */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<School />}
                onClick={() => navigate('/courses')}
              >
                Browse Courses
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Person />}
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Schedule />}
              >
                View Schedule
              </Button>
            </Box>
          </Paper>

          {/* Profile Summary */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Profile Summary
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText 
                  primary="Name" 
                  secondary={user?.name || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><Email /></ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={user?.email || 'Not provided'} 
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><School /></ListItemIcon>
                <ListItemText 
                  primary="Department" 
                  secondary={dashboardData.student?.academicInfo?.department || 'Not specified'} 
                />
              </ListItem>
            </List>
            <Button 
              variant="text" 
              fullWidth 
              startIcon={<Edit />}
              onClick={() => navigate('/profile')}
              sx={{ mt: 2 }}
            >
              Complete Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Profile Dialog */}
      <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Profile Information
            <IconButton onClick={() => setProfileOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar src={user?.avatar} sx={{ width: 100, height: 100, mb: 2 }}>
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            <Chip 
              label={user?.role === 'admin' ? 'Administrator' : 'Student'} 
              color="primary" 
              size="small" 
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate('/profile')} variant="contained">
            Edit Profile
          </Button>
          <Button onClick={() => setProfileOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard;