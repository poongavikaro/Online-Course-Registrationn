import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Download,
  Visibility,
  Close,
  FileDownload,
  Analytics,
  TrendingUp,
} from '@mui/icons-material';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalUsers: 0,
    enrollmentStats: [],
    departmentStats: [],
    recentEnrollments: []
  });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    limit: 10
  });

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  useEffect(() => {
    if (activeTab === 1) {
      fetchStudents();
    }
  }, [activeTab, filters]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await axios.get(`/api/admin/students?${params}`);
      setStudents(response.data.students);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleExportStudents = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      
      const response = await axios.get(`/api/admin/export/students?${params}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `student_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Student data exported successfully!');
    } catch (error) {
      console.error('Error exporting students:', error);
      toast.error('Failed to export student data');
    }
  };

  const handleExportCourses = async () => {
    try {
      const response = await axios.get('/api/admin/export/courses', {
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `course_enrollments_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Course data exported successfully!');
    } catch (error) {
      console.error('Error exporting courses:', error);
      toast.error('Failed to export course data');
    }
  };

  const handleViewStudent = async (studentId) => {
    try {
      const response = await axios.get(`/api/admin/students/${studentId}`);
      setSelectedStudent(response.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const stats = [
    {
      title: 'Total Students',
      value: dashboardData.totalStudents,
      icon: <People />,
      color: 'primary.main'
    },
    {
      title: 'Total Courses',
      value: dashboardData.totalCourses,
      icon: <School />,
      color: 'success.main'
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUsers,
      icon: <Dashboard />,
      color: 'info.main'
    },
    {
      title: 'Active Enrollments',
      value: dashboardData.enrollmentStats?.find(stat => stat._id === 'enrolled')?.count || 0,
      icon: <TrendingUp />,
      color: 'warning.main'
    }
  ];

  if (loading && activeTab === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage students, courses, and view analytics
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" icon={<Dashboard />} />
          <Tab label="Students" icon={<People />} />
          <Tab label="Analytics" icon={<Analytics />} />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
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

          {/* Export Buttons */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Export Student Data
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Download student registration data in Excel format
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  onClick={handleExportStudents}
                  fullWidth
                >
                  Export Students to Excel
                </Button>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Export Course Data
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Download course enrollment data in Excel format
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FileDownload />}
                  onClick={handleExportCourses}
                  fullWidth
                >
                  Export Courses to Excel
                </Button>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Enrollments */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Recent Enrollments
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Courses</TableCell>
                    <TableCell>Registration Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentEnrollments?.slice(0, 5).map((enrollment, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar src={enrollment.userId?.avatar} sx={{ width: 32, height: 32 }}>
                            {enrollment.userId?.name?.charAt(0)}
                          </Avatar>
                          {enrollment.userId?.name}
                        </Box>
                      </TableCell>
                      <TableCell>{enrollment.userId?.email}</TableCell>
                      <TableCell>{enrollment.enrolledCourses?.length || 0}</TableCell>
                      <TableCell>
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Students Tab */}
      {activeTab === 1 && (
        <>
          {/* Filters */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search students"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    label="Department"
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                  >
                    <MenuItem value="">All Departments</MenuItem>
                    <MenuItem value="Engineering">Engineering</MenuItem>
                    <MenuItem value="Computer Science">Computer Science</MenuItem>
                    <MenuItem value="Information Technology">Information Technology</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Mechanical">Mechanical</MenuItem>
                    <MenuItem value="Civil">Civil</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleExportStudents}
                  fullWidth
                >
                  Export Filtered Data
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Students Table */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Students ({pagination.total})
            </Typography>
            {loading ? (
              <LinearProgress sx={{ mb: 2 }} />
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Student ID</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Enrolled Courses</TableCell>
                      <TableCell>Registration Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={student.userId?.avatar} sx={{ width: 32, height: 32 }}>
                              {student.userId?.name?.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {`${student.personalInfo?.firstName} ${student.personalInfo?.lastName}`}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {student.userId?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>{student.studentId}</TableCell>
                        <TableCell>
                          <Chip 
                            label={student.academicInfo?.department || 'Not specified'} 
                            size="small" 
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{student.enrolledCourses?.length || 0}</TableCell>
                        <TableCell>
                          {new Date(student.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleViewStudent(student._id)}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                disabled={pagination.current === 1}
                onClick={() => handleFilterChange('page', pagination.current - 1)}
              >
                Previous
              </Button>
              <Typography sx={{ mx: 2, alignSelf: 'center' }}>
                Page {pagination.current} of {pagination.pages}
              </Typography>
              <Button
                disabled={pagination.current === pagination.pages}
                onClick={() => handleFilterChange('page', pagination.current + 1)}
              >
                Next
              </Button>
            </Box>
          </Paper>
        </>
      )}

      {/* Analytics Tab */}
      {activeTab === 2 && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Department Distribution
              </Typography>
              {dashboardData.departmentStats?.map((dept, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{dept._id || 'Not specified'}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {dept.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(dept.count / dashboardData.totalStudents) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Enrollment Status
              </Typography>
              {dashboardData.enrollmentStats?.map((stat, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {stat._id}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {stat.count}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(stat.count / (dashboardData.enrollmentStats?.reduce((sum, s) => sum + s.count, 0) || 1)) * 100}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Student Detail Dialog */}
      <Dialog
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedStudent && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Student Details
                <IconButton onClick={() => setSelectedStudent(null)}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Personal Information</Typography>
                  <Typography variant="body2">
                    <strong>Name:</strong> {`${selectedStudent.personalInfo?.firstName} ${selectedStudent.personalInfo?.lastName}`}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Email:</strong> {selectedStudent.userId?.email}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Phone:</strong> {selectedStudent.personalInfo?.phone || 'Not provided'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Gender:</strong> {selectedStudent.personalInfo?.gender || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Academic Information</Typography>
                  <Typography variant="body2">
                    <strong>Student ID:</strong> {selectedStudent.studentId}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Department:</strong> {selectedStudent.academicInfo?.department || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Year:</strong> {selectedStudent.academicInfo?.year || 'Not specified'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>CGPA:</strong> {selectedStudent.academicInfo?.cgpa || 'Not specified'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Enrolled Courses</Typography>
                  {selectedStudent.enrolledCourses?.length > 0 ? (
                    selectedStudent.enrolledCourses.map((enrollment, index) => (
                      <Chip
                        key={index}
                        label={enrollment.courseId?.title || 'Course'}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No courses enrolled
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;