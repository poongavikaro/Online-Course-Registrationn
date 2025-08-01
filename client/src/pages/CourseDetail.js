import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  School,
  Schedule,
  Person,
  AttachMoney,
  CheckCircle,
  BookmarkBorder,
  Assignment,
  PlayCircleOutline,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) {
      checkEnrollment();
    }
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const response = await axios.get('/api/students/courses');
      const enrolled = response.data.some(enrollment => 
        enrollment.courseId?._id === id
      );
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/students/enroll/${id}`);
      toast.success('Successfully enrolled in course!');
      setIsEnrolled(true);
      fetchCourse(); // Refresh to update enrollment count
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6">Course not found</Typography>
        <Button onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/courses')}
        sx={{ mb: 3 }}
      >
        Back to Courses
      </Button>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            {/* Course Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip label={course.department} color="primary" />
                <Chip label={course.category} variant="outlined" />
                <Chip label={course.level} color={getLevelColor(course.level)} />
                {isEnrolled && (
                  <Chip
                    icon={<CheckCircle />}
                    label="Enrolled"
                    color="success"
                  />
                )}
              </Box>
              
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                {course.title}
              </Typography>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {course.courseCode}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {course.description}
              </Typography>
            </Box>

            {/* Course Details */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <School color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{course.credits}</Typography>
                  <Typography variant="caption">Credits</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Schedule color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{course.duration}</Typography>
                  <Typography variant="caption">Duration</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Person color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">{course.enrolled}/{course.capacity}</Typography>
                  <Typography variant="caption">Enrolled</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <AttachMoney color="primary" sx={{ fontSize: 32, mb: 1 }} />
                  <Typography variant="h6">${course.fees}</Typography>
                  <Typography variant="caption">Fee</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Prerequisites */}
            {course.prerequisites && course.prerequisites.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Prerequisites
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {course.prerequisites.map((prereq, index) => (
                    <Chip key={index} label={prereq} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            {/* Syllabus */}
            {course.syllabus && course.syllabus.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Course Syllabus
                </Typography>
                <List>
                  {course.syllabus.map((week, index) => (
                    <ListItem key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                      <ListItemIcon>
                        <PlayCircleOutline color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Week ${week.week}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" component="div">
                              <strong>Topics:</strong> {week.topics?.join(', ')}
                            </Typography>
                            {week.assignments && week.assignments.length > 0 && (
                              <Typography variant="body2" component="div">
                                <strong>Assignments:</strong> {week.assignments.join(', ')}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {/* Resources */}
            {course.resources && course.resources.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Course Resources
                </Typography>
                <List>
                  {course.resources.map((resource, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Assignment color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={resource.title}
                        secondary={`Type: ${resource.type}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Instructor */}
          {course.instructor && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Instructor
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 60, height: 60 }}>
                  {course.instructor.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {course.instructor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.instructor.qualification}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {course.instructor.experience} experience
                  </Typography>
                </Box>
              </Box>
              {course.instructor.email && (
                <Typography variant="body2" color="text.secondary">
                  {course.instructor.email}
                </Typography>
              )}
            </Paper>
          )}

          {/* Schedule */}
          {course.schedule && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Schedule
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Mode"
                    secondary={course.schedule.mode || 'Online'}
                  />
                </ListItem>
                {course.schedule.days && (
                  <ListItem>
                    <ListItemText
                      primary="Days"
                      secondary={course.schedule.days.join(', ')}
                    />
                  </ListItem>
                )}
                {course.schedule.time && (
                  <ListItem>
                    <ListItemText
                      primary="Time"
                      secondary={course.schedule.time}
                    />
                  </ListItem>
                )}
                {course.schedule.startDate && (
                  <ListItem>
                    <ListItemText
                      primary="Start Date"
                      secondary={new Date(course.schedule.startDate).toLocaleDateString()}
                    />
                  </ListItem>
                )}
                {course.schedule.endDate && (
                  <ListItem>
                    <ListItemText
                      primary="End Date"
                      secondary={new Date(course.schedule.endDate).toLocaleDateString()}
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          )}

          {/* Enrollment */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Enrollment
            </Typography>
            <Box sx={{ mb: 3 }}>
              <LinearProgress
                variant="determinate"
                value={(course.enrolled / course.capacity) * 100}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {course.enrolled} of {course.capacity} spots filled
              </Typography>
            </Box>
            
            {user ? (
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleEnroll}
                disabled={isEnrolled || course.enrolled >= course.capacity}
                startIcon={isEnrolled ? <CheckCircle /> : <BookmarkBorder />}
              >
                {isEnrolled 
                  ? 'Already Enrolled' 
                  : course.enrolled >= course.capacity 
                    ? 'Course Full' 
                    : 'Enroll Now'
                }
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
              >
                Sign In to Enroll
              </Button>
            )}
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Fee: ${course.fees}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseDetail;