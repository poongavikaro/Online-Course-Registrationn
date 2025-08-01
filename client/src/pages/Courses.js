import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Search,
  FilterList,
  School,
  Schedule,
  Person,
  AttachMoney,
  Close,
  BookmarkBorder,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../App';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    department: searchParams.get('department') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
  });
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchDepartments();
    fetchCategories();
    if (user) {
      fetchEnrolledCourses();
    }
  }, [filters, user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/courses?${params}`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/courses/meta/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/courses/meta/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const response = await axios.get('/api/students/courses');
      setEnrolledCourses(response.data.map(enrollment => enrollment.courseId?._id));
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.append(k, v);
    });
    setSearchParams(params);
  };

  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post(`/api/students/enroll/${courseId}`);
      toast.success('Successfully enrolled in course!');
      fetchEnrolledCourses();
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast.error(error.response?.data?.message || 'Failed to enroll in course');
    }
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'error';
      default: return 'default';
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      department: '',
      category: '',
      level: '',
    });
    setSearchParams({});
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Course Catalog
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover and enroll in courses across various departments
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <FilterList />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filter Courses
          </Typography>
          <Button size="small" onClick={clearFilters}>
            Clear All
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search courses"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={filters.department}
                label="Department"
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <MenuItem value="">All Departments</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Level</InputLabel>
              <Select
                value={filters.level}
                label="Level"
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {loading ? 'Loading...' : `Found ${courses.length} courses`}
        </Typography>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress />
        </Box>
      )}

      {/* Courses Grid */}
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={6} lg={4} key={course._id}>
            <Card 
              className="course-card"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative'
              }}
            >
              {isEnrolled(course._id) && (
                <Chip
                  icon={<CheckCircle />}
                  label="Enrolled"
                  color="success"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1
                  }}
                />
              )}
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Chip label={course.department} size="small" color="primary" />
                  <Chip 
                    label={course.level} 
                    size="small" 
                    color={getLevelColor(course.level)}
                  />
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {course.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description.length > 100 
                    ? `${course.description.substring(0, 100)}...` 
                    : course.description
                  }
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  <Chip label={course.category} size="small" variant="outlined" />
                  <Chip label={`${course.credits} Credits`} size="small" variant="outlined" />
                  <Chip label={course.duration} size="small" variant="outlined" />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="caption">
                      {course.enrolled}/{course.capacity}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AttachMoney fontSize="small" color="action" />
                    <Typography variant="caption">
                      ${course.fees}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Schedule fontSize="small" color="action" />
                    <Typography variant="caption">
                      {course.schedule?.mode || 'Online'}
                    </Typography>
                  </Box>
                </Box>

                {course.instructor && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                      {course.instructor.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      {course.instructor.name}
                    </Typography>
                  </Box>
                )}
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="small"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Details
                </Button>
                {user ? (
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleEnroll(course._id)}
                    disabled={isEnrolled(course._id) || course.enrolled >= course.capacity}
                    startIcon={isEnrolled(course._id) ? <CheckCircle /> : <BookmarkBorder />}
                  >
                    {isEnrolled(course._id) 
                      ? 'Enrolled' 
                      : course.enrolled >= course.capacity 
                        ? 'Full' 
                        : 'Enroll'
                    }
                  </Button>
                ) : (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate('/login')}
                  >
                    Sign In to Enroll
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* No Results */}
      {!loading && courses.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <School sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms
          </Typography>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      )}

      {/* Course Detail Dialog */}
      <Dialog 
        open={!!selectedCourse} 
        onClose={() => setSelectedCourse(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedCourse && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{selectedCourse.title}</Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {selectedCourse.courseCode} • {selectedCourse.department}
                  </Typography>
                </Box>
                <IconButton onClick={() => setSelectedCourse(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={selectedCourse.category} color="primary" />
                  <Chip label={selectedCourse.level} color={getLevelColor(selectedCourse.level)} />
                  <Chip label={`${selectedCourse.credits} Credits`} variant="outlined" />
                  <Chip label={selectedCourse.duration} variant="outlined" />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {selectedCourse.description}
                </Typography>

                {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Prerequisites:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedCourse.prerequisites.map((prereq, index) => (
                        <Chip key={index} label={prereq} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                {selectedCourse.instructor && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Instructor:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar>{selectedCourse.instructor.name?.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2">{selectedCourse.instructor.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {selectedCourse.instructor.qualification}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                  <Typography variant="body2">
                    <strong>Enrolled:</strong> {selectedCourse.enrolled}/{selectedCourse.capacity}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Fee:</strong> ${selectedCourse.fees}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mode:</strong> {selectedCourse.schedule?.mode || 'Online'}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedCourse(null)}>
                Close
              </Button>
              {user ? (
                <Button
                  variant="contained"
                  onClick={() => handleEnroll(selectedCourse._id)}
                  disabled={isEnrolled(selectedCourse._id) || selectedCourse.enrolled >= selectedCourse.capacity}
                >
                  {isEnrolled(selectedCourse._id) 
                    ? 'Already Enrolled' 
                    : selectedCourse.enrolled >= selectedCourse.capacity 
                      ? 'Course Full' 
                      : 'Enroll Now'
                  }
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate('/login')}
                >
                  Sign In to Enroll
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Courses;