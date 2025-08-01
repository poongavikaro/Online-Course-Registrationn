import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { Google, School, Security, Devices } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const features = [
    {
      icon: <School />,
      title: 'Access All Courses',
      description: 'Browse and enroll in courses from multiple departments'
    },
    {
      icon: <Security />,
      title: 'Secure Authentication',
      description: 'Your data is protected with Google OAuth security'
    },
    {
      icon: <Devices />,
      title: 'Multi-Device Access',
      description: 'Access your account from any device, anywhere'
    }
  ];

  return (
    <Box sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: 'center' }}>
          {/* Left Side - Information */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
              Welcome Back!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Sign in to continue your learning journey and access your personalized dashboard.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right Side - Login Form */}
          <Box sx={{ flex: 1, maxWidth: 400, width: '100%' }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <School sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Sign In
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Use your Google account to sign in securely
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                sx={{
                  py: 1.5,
                  bgcolor: '#4285f4',
                  '&:hover': {
                    bgcolor: '#3367d6',
                  },
                  mb: 3,
                }}
              >
                Continue with Google
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Secure & Fast
                </Typography>
              </Divider>

              <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Multi-Device Support:</strong><br />
                    Sign in once and access your account from any device. 
                    We'll remember your preferences and sync your progress.
                  </Typography>
                </CardContent>
              </Card>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account? No problem!<br />
                  <strong>Signing in with Google will create your account automatically.</strong>
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;