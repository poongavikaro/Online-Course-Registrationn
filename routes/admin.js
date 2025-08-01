const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const Student = require('../models/Student');
const Course = require('../models/Course');
const User = require('../models/User');

// Middleware to check if user is authenticated and is admin
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied. Admin only.' });
};

// Get admin dashboard statistics
router.get('/dashboard', ensureAdmin, async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({ isActive: true });
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ isActive: true });
    
    // Get enrollment statistics
    const enrollmentStats = await Student.aggregate([
      { $unwind: '$enrolledCourses' },
      { $group: { _id: '$enrolledCourses.status', count: { $sum: 1 } } }
    ]);

    // Get department-wise student distribution
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$academicInfo.department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent enrollments
    const recentEnrollments = await Student.find({ isActive: true })
      .populate('userId', 'name email')
      .populate('enrolledCourses.courseId', 'title courseCode')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalStudents,
      totalCourses,
      totalUsers,
      enrollmentStats,
      departmentStats,
      recentEnrollments
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Get all students with pagination and filters
router.get('/students', ensureAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { department, search, status } = req.query;
    let filter = { isActive: true };

    if (department) {
      filter['academicInfo.department'] = department;
    }

    if (status) {
      filter['enrolledCourses.status'] = status;
    }

    if (search) {
      filter.$or = [
        { 'personalInfo.firstName': { $regex: search, $options: 'i' } },
        { 'personalInfo.lastName': { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(filter)
      .populate('userId', 'name email avatar lastLogin')
      .populate('enrolledCourses.courseId', 'title courseCode department category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments(filter);

    res.json({
      students,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Get student details by ID
router.get('/students/:id', ensureAdmin, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email avatar lastLogin devices')
      .populate('enrolledCourses.courseId');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ message: 'Error fetching student details' });
  }
});

// Export students data to Excel
router.get('/export/students', ensureAdmin, async (req, res) => {
  try {
    const { department, format = 'xlsx' } = req.query;
    let filter = { isActive: true };

    if (department) {
      filter['academicInfo.department'] = department;
    }

    const students = await Student.find(filter)
      .populate('userId', 'name email lastLogin')
      .populate('enrolledCourses.courseId', 'title courseCode department category fees');

    // Prepare data for Excel export
    const excelData = [];

    students.forEach((student) => {
      const baseInfo = {
        'Student ID': student.studentId,
        'Full Name': `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
        'Email': student.userId?.email || '',
        'Phone': student.personalInfo.phone || '',
        'Department': student.academicInfo.department,
        'Year': student.academicInfo.year || '',
        'Semester': student.academicInfo.semester || '',
        'CGPA': student.academicInfo.cgpa || '',
        'Gender': student.personalInfo.gender || '',
        'Date of Birth': student.personalInfo.dateOfBirth ? 
          student.personalInfo.dateOfBirth.toISOString().split('T')[0] : '',
        'Address': student.personalInfo.address ? 
          `${student.personalInfo.address.street || ''}, ${student.personalInfo.address.city || ''}, ${student.personalInfo.address.state || ''}` : '',
        'Registration Date': student.createdAt.toISOString().split('T')[0],
        'Last Login': student.userId?.lastLogin ? 
          student.userId.lastLogin.toISOString().split('T')[0] : '',
        'Total Enrolled Courses': student.enrolledCourses.length
      };

      if (student.enrolledCourses.length === 0) {
        excelData.push({
          ...baseInfo,
          'Course Code': '',
          'Course Title': '',
          'Course Department': '',
          'Course Category': '',
          'Course Fees': '',
          'Enrollment Date': '',
          'Enrollment Status': ''
        });
      } else {
        student.enrolledCourses.forEach((enrollment) => {
          excelData.push({
            ...baseInfo,
            'Course Code': enrollment.courseId?.courseCode || '',
            'Course Title': enrollment.courseId?.title || '',
            'Course Department': enrollment.courseId?.department || '',
            'Course Category': enrollment.courseId?.category || '',
            'Course Fees': enrollment.courseId?.fees || '',
            'Enrollment Date': enrollment.enrollmentDate.toISOString().split('T')[0],
            'Enrollment Status': enrollment.status,
            'Grade': enrollment.grade || '',
            'Completion Date': enrollment.completionDate ? 
              enrollment.completionDate.toISOString().split('T')[0] : ''
          });
        });
      }
    });

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = [];
    Object.keys(excelData[0] || {}).forEach((key) => {
      colWidths.push({ wch: Math.max(key.length, 15) });
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Student Registrations');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: format });

    // Set response headers
    const filename = `student_registrations_${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting students data:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// Export course-wise enrollment data
router.get('/export/courses', ensureAdmin, async (req, res) => {
  try {
    const { department, format = 'xlsx' } = req.query;
    let filter = { isActive: true };

    if (department) {
      filter.department = department;
    }

    const courses = await Course.find(filter);
    const students = await Student.find({ isActive: true })
      .populate('userId', 'name email')
      .populate('enrolledCourses.courseId');

    const excelData = [];

    courses.forEach((course) => {
      const enrolledStudents = students.filter(student =>
        student.enrolledCourses.some(enrollment =>
          enrollment.courseId && enrollment.courseId._id.toString() === course._id.toString()
        )
      );

      if (enrolledStudents.length === 0) {
        excelData.push({
          'Course Code': course.courseCode,
          'Course Title': course.title,
          'Department': course.department,
          'Category': course.category,
          'Credits': course.credits,
          'Duration': course.duration,
          'Level': course.level,
          'Fees': course.fees,
          'Capacity': course.capacity,
          'Enrolled Count': course.enrolled,
          'Available Slots': course.capacity - course.enrolled,
          'Student Name': '',
          'Student Email': '',
          'Student ID': '',
          'Enrollment Date': '',
          'Status': ''
        });
      } else {
        enrolledStudents.forEach((student) => {
          const enrollment = student.enrolledCourses.find(e =>
            e.courseId && e.courseId._id.toString() === course._id.toString()
          );

          excelData.push({
            'Course Code': course.courseCode,
            'Course Title': course.title,
            'Department': course.department,
            'Category': course.category,
            'Credits': course.credits,
            'Duration': course.duration,
            'Level': course.level,
            'Fees': course.fees,
            'Capacity': course.capacity,
            'Enrolled Count': course.enrolled,
            'Available Slots': course.capacity - course.enrolled,
            'Student Name': `${student.personalInfo.firstName} ${student.personalInfo.lastName}`,
            'Student Email': student.userId?.email || '',
            'Student ID': student.studentId,
            'Enrollment Date': enrollment?.enrollmentDate.toISOString().split('T')[0] || '',
            'Status': enrollment?.status || '',
            'Grade': enrollment?.grade || ''
          });
        });
      }
    });

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = [];
    Object.keys(excelData[0] || {}).forEach((key) => {
      colWidths.push({ wch: Math.max(key.length, 15) });
    });
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Course Enrollments');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: format });

    // Set response headers
    const filename = `course_enrollments_${new Date().toISOString().split('T')[0]}.${format}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    res.send(buffer);
  } catch (error) {
    console.error('Error exporting course data:', error);
    res.status(500).json({ message: 'Error exporting data' });
  }
});

// Update student status
router.put('/students/:id/status', ensureAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).populate('userId', 'name email');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error updating student status:', error);
    res.status(500).json({ message: 'Error updating student status' });
  }
});

// Get enrollment analytics
router.get('/analytics/enrollments', ensureAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let matchStage = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Student.aggregate([
      { $match: matchStage },
      { $unwind: '$enrolledCourses' },
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses.courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: {
            department: '$course.department',
            category: '$course.category'
          },
          count: { $sum: 1 },
          courses: { $addToSet: '$course.title' }
        }
      },
      {
        $group: {
          _id: '$_id.department',
          categories: {
            $push: {
              category: '$_id.category',
              count: '$count',
              courses: '$courses'
            }
          },
          totalEnrollments: { $sum: '$count' }
        }
      },
      { $sort: { totalEnrollments: -1 } }
    ]);

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching enrollment analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;