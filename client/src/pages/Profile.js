import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
} from '@mui/material';
import { Save, Person, School, Edit } from '@mui/icons-material';
import { useAuth } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      }
    },
    academicInfo: {
      department: '',
      year: '',
      semester: '',
      cgpa: '',
      previousEducation: ''
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/students/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        address: {
          ...prev.personalInfo.address,
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put('/api/students/profile', profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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
          My Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your personal and academic information
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user?.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Typography variant="caption" color="primary">
              Student ID: {profile.studentId || 'Not assigned'}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="subtitle2" gutterBottom>
                Quick Info
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Department: {profile.academicInfo?.department || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year: {profile.academicInfo?.year || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                CGPA: {profile.academicInfo?.cgpa || 'Not specified'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Form */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* Personal Information */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Person />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Personal Information
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    value={profile.personalInfo?.firstName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    value={profile.personalInfo?.lastName || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={profile.personalInfo?.dateOfBirth ? 
                      new Date(profile.personalInfo.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={profile.personalInfo?.gender || ''}
                      label="Gender"
                      onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profile.personalInfo?.phone || ''}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Address */}
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 600 }}>
                Address
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    value={profile.personalInfo?.address?.street || ''}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    value={profile.personalInfo?.address?.city || ''}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State"
                    value={profile.personalInfo?.address?.state || ''}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    value={profile.personalInfo?.address?.zipCode || ''}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={profile.personalInfo?.address?.country || ''}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Academic Information */}
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <School />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Academic Information
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={profile.academicInfo?.department || ''}
                      label="Department"
                      onChange={(e) => handleInputChange('academicInfo', 'department', e.target.value)}
                    >
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Computer Science">Computer Science</MenuItem>
                      <MenuItem value="Information Technology">Information Technology</MenuItem>
                      <MenuItem value="Electronics">Electronics</MenuItem>
                      <MenuItem value="Mechanical">Mechanical</MenuItem>
                      <MenuItem value="Civil">Civil</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={profile.academicInfo?.year || ''}
                      label="Year"
                      onChange={(e) => handleInputChange('academicInfo', 'year', e.target.value)}
                    >
                      <MenuItem value="1st Year">1st Year</MenuItem>
                      <MenuItem value="2nd Year">2nd Year</MenuItem>
                      <MenuItem value="3rd Year">3rd Year</MenuItem>
                      <MenuItem value="4th Year">4th Year</MenuItem>
                      <MenuItem value="Graduate">Graduate</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      value={profile.academicInfo?.semester || ''}
                      label="Semester"
                      onChange={(e) => handleInputChange('academicInfo', 'semester', e.target.value)}
                    >
                      <MenuItem value="1st Semester">1st Semester</MenuItem>
                      <MenuItem value="2nd Semester">2nd Semester</MenuItem>
                      <MenuItem value="3rd Semester">3rd Semester</MenuItem>
                      <MenuItem value="4th Semester">4th Semester</MenuItem>
                      <MenuItem value="5th Semester">5th Semester</MenuItem>
                      <MenuItem value="6th Semester">6th Semester</MenuItem>
                      <MenuItem value="7th Semester">7th Semester</MenuItem>
                      <MenuItem value="8th Semester">8th Semester</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="CGPA"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.01 }}
                    value={profile.academicInfo?.cgpa || ''}
                    onChange={(e) => handleInputChange('academicInfo', 'cgpa', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Previous Education"
                    multiline
                    rows={3}
                    value={profile.academicInfo?.previousEducation || ''}
                    onChange={(e) => handleInputChange('academicInfo', 'previousEducation', e.target.value)}
                    placeholder="Describe your previous educational background..."
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Save Button */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={saving}
                sx={{ px: 4 }}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;