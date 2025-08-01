import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  School,
  Computer,
  Engineering,
  CloudQueue,
  Security,
  Code,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Computer />,
      title: 'Computer Science',
      description: 'Learn programming, algorithms, and software development with hands-on projects.',
      courses: ['Web Development', 'Data Structures', 'Machine Learning']
    },
    {
      icon: <Engineering />,
      title: 'Engineering',
      description: 'Explore various engineering disciplines with practical applications.',
      courses: ['Mechanical Design', 'Electrical Systems', 'Civil Engineering']
    },
    {
      icon: <CloudQueue />,
      title: 'Cloud Computing',
      description: 'Master cloud technologies and modern infrastructure management.',
      courses: ['AWS Fundamentals', 'DevOps', 'Microservices']
    },
    {
      icon: <Security />,
      title: 'Cybersecurity',
      description: 'Protect digital assets and learn ethical hacking techniques.',
      courses: ['Network Security', 'Penetration Testing', 'Digital Forensics']
    },
  ];

  const stats = [
    { number: '500+', label: 'Courses Available' },
    { number: '10K+', label: 'Students Enrolled' },
    { number: '50+', label: 'Expert Instructors' },
    { number: '95%', label: 'Success Rate' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        className="hero-bg"
        sx={{
          py: { xs: 8, md: 12 },
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 3 }}
          >
            Transform Your Future with
            <br />
            Online Course Registration
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            Discover thousands of courses across multiple departments. 
            Register easily, track your progress, and achieve your learning goals.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  }
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  }
                }}
              >
                Get Started
              </Button>
            )}
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/courses')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              Browse Courses
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            sx={{ textAlign: 'center', mb: 2, fontWeight: 600 }}
          >
            Popular Departments
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: 'center', mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Explore our diverse range of courses across different departments, 
            designed to meet industry standards and career goals.
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  className="card-hover"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    p: 2,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: 'primary.light',
                          color: 'white',
                          width: 64,
                          height: 64,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {feature.icon}
                      </Box>
                    </Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {feature.courses.map((course, idx) => (
                        <Chip
                          key={idx}
                          label={course}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/courses?department=${encodeURIComponent(feature.title)}`)}
                    >
                      View Courses
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, bgcolor: 'primary.main', color: 'white' }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <School sx={{ fontSize: 60, mb: 2, opacity: 0.8 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Ready to Start Learning?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of students who are already advancing their careers with our courses.
            </Typography>
            {!user && (
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: 'grey.100',
                  }
                }}
              >
                Sign Up Today
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;