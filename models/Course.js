const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Engineering', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'Other']
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Cloud Computing',
      'Artificial Intelligence',
      'Machine Learning',
      'Data Science',
      'Web Development',
      'Mobile Development',
      'Cybersecurity',
      'Software Engineering',
      'Database Management',
      'Network Engineering',
      'DevOps',
      'Blockchain',
      'IoT',
      'Robotics',
      'Embedded Systems',
      'Digital Electronics',
      'Power Systems',
      'Control Systems',
      'Structural Engineering',
      'Environmental Engineering',
      'Mechanical Design',
      'Thermodynamics',
      'Materials Science',
      'Project Management',
      'Other'
    ]
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6
  },
  duration: {
    type: String,
    required: true,
    enum: ['1 Month', '2 Months', '3 Months', '6 Months', '1 Year', 'Custom']
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  prerequisites: [String],
  instructor: {
    name: String,
    email: String,
    qualification: String,
    experience: String
  },
  schedule: {
    startDate: Date,
    endDate: Date,
    days: [String],
    time: String,
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Online'
    }
  },
  capacity: {
    type: Number,
    default: 50
  },
  enrolled: {
    type: Number,
    default: 0
  },
  fees: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  syllabus: [{
    week: Number,
    topics: [String],
    assignments: [String]
  }],
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['PDF', 'Video', 'Link', 'Document']
    },
    url: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);