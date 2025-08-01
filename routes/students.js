const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Course = require('../models/Course');
const User = require('../models/User');

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
};

// Generate unique student ID
const generateStudentId = async () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await Student.countDocuments();
  const studentNumber = (count + 1).toString().padStart(4, '0');
  return `STU${year}${studentNumber}`;
};

// Get or create student profile
router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    let student = await Student.findOne({ userId: req.user._id })
      .populate('enrolledCourses.courseId');

    if (!student) {
      // Create new student profile
      const studentId = await generateStudentId();
      student = new Student({
        userId: req.user._id,
        studentId: studentId,
        personalInfo: {
          firstName: req.user.name.split(' ')[0] || '',
          lastName: req.user.name.split(' ').slice(1).join(' ') || ''
        },
        academicInfo: {
          department: 'Other' // Default department
        }
      });
      await student.save();
      student = await Student.findById(student._id)
        .populate('enrolledCourses.courseId');
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ message: 'Error fetching student profile' });
  }
});

// Update student profile
router.put('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('enrolledCourses.courseId');

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error updating student profile:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    res.status(500).json({ message: 'Error updating student profile' });
  }
});

// Enroll in a course
router.post('/enroll/:courseId', ensureAuthenticated, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    // Check if course exists and is active
    const course = await Course.findById(courseId);
    if (!course || !course.isActive) {
      return res.status(404).json({ message: 'Course not found or inactive' });
    }

    // Check if course is full
    if (course.enrolled >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Get or create student profile
    let student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      const studentId = await generateStudentId();
      student = new Student({
        userId: req.user._id,
        studentId: studentId,
        personalInfo: {
          firstName: req.user.name.split(' ')[0] || '',
          lastName: req.user.name.split(' ').slice(1).join(' ') || ''
        },
        academicInfo: {
          department: 'Other'
        }
      });
    }

    // Check if already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add course to student's enrolled courses
    student.enrolledCourses.push({
      courseId: courseId,
      status: 'enrolled'
    });

    await student.save();

    // Update course enrollment count
    course.enrolled += 1;
    await course.save();

    // Populate the response
    await student.populate('enrolledCourses.courseId');

    res.json({ 
      message: 'Successfully enrolled in course',
      student: student
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Error enrolling in course' });
  }
});

// Drop a course
router.delete('/enroll/:courseId', ensureAuthenticated, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Find the enrollment
    const enrollmentIndex = student.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    // Remove the enrollment
    student.enrolledCourses.splice(enrollmentIndex, 1);
    await student.save();

    // Update course enrollment count
    const course = await Course.findById(courseId);
    if (course) {
      course.enrolled = Math.max(0, course.enrolled - 1);
      await course.save();
    }

    await student.populate('enrolledCourses.courseId');

    res.json({ 
      message: 'Successfully dropped course',
      student: student
    });
  } catch (error) {
    console.error('Error dropping course:', error);
    res.status(500).json({ message: 'Error dropping course' });
  }
});

// Get enrolled courses
router.get('/courses', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('enrolledCourses.courseId');

    if (!student) {
      return res.json([]);
    }

    res.json(student.enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
});

// Get student dashboard data
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id })
      .populate('enrolledCourses.courseId');

    if (!student) {
      return res.json({
        totalCourses: 0,
        activeCourses: 0,
        completedCourses: 0,
        enrolledCourses: []
      });
    }

    const totalCourses = student.enrolledCourses.length;
    const activeCourses = student.enrolledCourses.filter(
      enrollment => enrollment.status === 'enrolled' || enrollment.status === 'in-progress'
    ).length;
    const completedCourses = student.enrolledCourses.filter(
      enrollment => enrollment.status === 'completed'
    ).length;

    res.json({
      totalCourses,
      activeCourses,
      completedCourses,
      enrolledCourses: student.enrolledCourses,
      student: student
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

module.exports = router;