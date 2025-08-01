const mongoose = require('mongoose');
const Course = require('../models/Course');
require('dotenv').config();

const sampleCourses = [
  // Computer Science Courses
  {
    courseCode: 'CS101',
    title: 'Introduction to Programming',
    description: 'Learn the fundamentals of programming using Python. This course covers variables, data types, control structures, functions, and basic algorithms.',
    department: 'Computer Science',
    category: 'Web Development',
    credits: 3,
    duration: '3 Months',
    level: 'Beginner',
    prerequisites: [],
    instructor: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      qualification: 'PhD in Computer Science',
      experience: '8 years'
    },
    schedule: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-01'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '10:00 AM - 11:30 AM',
      mode: 'Online'
    },
    capacity: 50,
    enrolled: 32,
    fees: 299,
    syllabus: [
      {
        week: 1,
        topics: ['Python Basics', 'Variables and Data Types'],
        assignments: ['Hello World Program', 'Variable Practice']
      },
      {
        week: 2,
        topics: ['Control Structures', 'Loops'],
        assignments: ['Calculator Program', 'Number Guessing Game']
      }
    ]
  },
  {
    courseCode: 'CS201',
    title: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, JavaScript, and modern web development frameworks. Build responsive websites and dynamic web applications.',
    department: 'Computer Science',
    category: 'Web Development',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Basic programming knowledge'],
    instructor: {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      qualification: 'MS in Web Technologies',
      experience: '10 years'
    },
    schedule: {
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-08-15'),
      days: ['Tuesday', 'Thursday'],
      time: '2:00 PM - 4:00 PM',
      mode: 'Hybrid'
    },
    capacity: 40,
    enrolled: 28,
    fees: 599,
    syllabus: [
      {
        week: 1,
        topics: ['HTML Structure', 'CSS Styling'],
        assignments: ['Personal Portfolio Website']
      },
      {
        week: 2,
        topics: ['JavaScript Fundamentals', 'DOM Manipulation'],
        assignments: ['Interactive Web Page']
      }
    ]
  },
  {
    courseCode: 'CS301',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning algorithms, data preprocessing, model training, and evaluation using Python and scikit-learn.',
    department: 'Computer Science',
    category: 'Artificial Intelligence',
    credits: 4,
    duration: '6 Months',
    level: 'Advanced',
    prerequisites: ['Python programming', 'Statistics', 'Linear Algebra'],
    instructor: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@university.edu',
      qualification: 'PhD in Machine Learning',
      experience: '12 years'
    },
    schedule: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-01'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '9:00 AM - 11:00 AM',
      mode: 'Online'
    },
    capacity: 30,
    enrolled: 22,
    fees: 899,
    syllabus: [
      {
        week: 1,
        topics: ['ML Introduction', 'Data Preprocessing'],
        assignments: ['Data Cleaning Project']
      },
      {
        week: 2,
        topics: ['Supervised Learning', 'Linear Regression'],
        assignments: ['Regression Model Implementation']
      }
    ]
  },

  // Engineering Courses
  {
    courseCode: 'ENG101',
    title: 'Introduction to Engineering',
    description: 'Fundamental concepts of engineering design, problem-solving methodologies, and professional practices in engineering.',
    department: 'Engineering',
    category: 'Project Management',
    credits: 3,
    duration: '3 Months',
    level: 'Beginner',
    prerequisites: [],
    instructor: {
      name: 'Prof. Robert Taylor',
      email: 'robert.taylor@university.edu',
      qualification: 'PhD in Engineering Management',
      experience: '15 years'
    },
    schedule: {
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-05-05'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '11:00 AM - 12:30 PM',
      mode: 'Offline'
    },
    capacity: 45,
    enrolled: 35,
    fees: 399,
    syllabus: [
      {
        week: 1,
        topics: ['Engineering Design Process', 'Problem Identification'],
        assignments: ['Design Thinking Exercise']
      }
    ]
  },
  {
    courseCode: 'ENG201',
    title: 'Cloud Computing with AWS',
    description: 'Master Amazon Web Services, cloud architecture, serverless computing, and modern cloud infrastructure management.',
    department: 'Engineering',
    category: 'Cloud Computing',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Basic networking', 'Linux fundamentals'],
    instructor: {
      name: 'Dr. Alex Kumar',
      email: 'alex.kumar@university.edu',
      qualification: 'MS in Cloud Computing',
      experience: '9 years'
    },
    schedule: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-01'),
      days: ['Tuesday', 'Thursday'],
      time: '6:00 PM - 8:00 PM',
      mode: 'Online'
    },
    capacity: 35,
    enrolled: 26,
    fees: 799,
    syllabus: [
      {
        week: 1,
        topics: ['AWS Introduction', 'EC2 Instances'],
        assignments: ['Launch First EC2 Instance']
      },
      {
        week: 2,
        topics: ['S3 Storage', 'VPC Networking'],
        assignments: ['Build Scalable Web App']
      }
    ]
  },

  // Information Technology Courses
  {
    courseCode: 'IT101',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn the basics of cybersecurity, threat assessment, network security, and ethical hacking techniques.',
    department: 'Information Technology',
    category: 'Cybersecurity',
    credits: 3,
    duration: '3 Months',
    level: 'Beginner',
    prerequisites: ['Basic networking knowledge'],
    instructor: {
      name: 'Prof. David Wilson',
      email: 'david.wilson@university.edu',
      qualification: 'MS in Cybersecurity',
      experience: '11 years'
    },
    schedule: {
      startDate: new Date('2024-02-10'),
      endDate: new Date('2024-05-10'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '3:00 PM - 4:30 PM',
      mode: 'Hybrid'
    },
    capacity: 40,
    enrolled: 31,
    fees: 699,
    syllabus: [
      {
        week: 1,
        topics: ['Security Fundamentals', 'Threat Landscape'],
        assignments: ['Security Assessment Report']
      }
    ]
  },
  {
    courseCode: 'IT201',
    title: 'DevOps and CI/CD',
    description: 'Master DevOps practices, continuous integration, deployment pipelines, Docker, Kubernetes, and automation tools.',
    department: 'Information Technology',
    category: 'DevOps',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Linux basics', 'Version control (Git)'],
    instructor: {
      name: 'Ms. Jennifer Brown',
      email: 'jennifer.brown@university.edu',
      qualification: 'MS in Software Engineering',
      experience: '8 years'
    },
    schedule: {
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-09-15'),
      days: ['Tuesday', 'Thursday'],
      time: '7:00 PM - 9:00 PM',
      mode: 'Online'
    },
    capacity: 30,
    enrolled: 23,
    fees: 899,
    syllabus: [
      {
        week: 1,
        topics: ['DevOps Introduction', 'Docker Containers'],
        assignments: ['Containerize Web Application']
      }
    ]
  },

  // Electronics Courses
  {
    courseCode: 'ECE101',
    title: 'Digital Electronics',
    description: 'Fundamentals of digital circuits, logic gates, Boolean algebra, and microprocessor systems.',
    department: 'Electronics',
    category: 'Digital Electronics',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Basic electronics', 'Mathematics'],
    instructor: {
      name: 'Dr. Lisa Park',
      email: 'lisa.park@university.edu',
      qualification: 'PhD in Electronics Engineering',
      experience: '14 years'
    },
    schedule: {
      startDate: new Date('2024-02-05'),
      endDate: new Date('2024-08-05'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '11:00 AM - 12:30 PM',
      mode: 'Offline'
    },
    capacity: 35,
    enrolled: 27,
    fees: 749,
    syllabus: [
      {
        week: 1,
        topics: ['Number Systems', 'Boolean Algebra'],
        assignments: ['Logic Circuit Design']
      }
    ]
  },
  {
    courseCode: 'ECE201',
    title: 'Embedded Systems Programming',
    description: 'Learn embedded systems development using Arduino and Raspberry Pi. Program microcontrollers and IoT devices.',
    department: 'Electronics',
    category: 'Embedded Systems',
    credits: 4,
    duration: '6 Months',
    level: 'Advanced',
    prerequisites: ['C programming', 'Digital electronics'],
    instructor: {
      name: 'Prof. James Miller',
      email: 'james.miller@university.edu',
      qualification: 'MS in Embedded Systems',
      experience: '10 years'
    },
    schedule: {
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-09-10'),
      days: ['Tuesday', 'Thursday'],
      time: '1:00 PM - 3:00 PM',
      mode: 'Hybrid'
    },
    capacity: 25,
    enrolled: 18,
    fees: 899,
    syllabus: [
      {
        week: 1,
        topics: ['Arduino Basics', 'Sensor Integration'],
        assignments: ['Temperature Monitoring System']
      }
    ]
  },

  // Mechanical Engineering Courses
  {
    courseCode: 'ME101',
    title: 'Mechanical Design Fundamentals',
    description: 'Principles of mechanical design, CAD software, engineering analysis, and manufacturing processes.',
    department: 'Mechanical',
    category: 'Mechanical Design',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Engineering mechanics', 'Materials science'],
    instructor: {
      name: 'Dr. Patricia Davis',
      email: 'patricia.davis@university.edu',
      qualification: 'PhD in Mechanical Engineering',
      experience: '16 years'
    },
    schedule: {
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-08-20'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '9:00 AM - 10:30 AM',
      mode: 'Offline'
    },
    capacity: 30,
    enrolled: 24,
    fees: 849,
    syllabus: [
      {
        week: 1,
        topics: ['Design Process', 'CAD Introduction'],
        assignments: ['3D Modeling Project']
      }
    ]
  },
  {
    courseCode: 'ME201',
    title: 'Thermodynamics and Heat Transfer',
    description: 'Study of thermodynamic principles, heat transfer mechanisms, and energy systems in mechanical engineering.',
    department: 'Mechanical',
    category: 'Thermodynamics',
    credits: 4,
    duration: '6 Months',
    level: 'Advanced',
    prerequisites: ['Physics', 'Calculus', 'Fluid mechanics'],
    instructor: {
      name: 'Prof. Richard Anderson',
      email: 'richard.anderson@university.edu',
      qualification: 'PhD in Thermal Engineering',
      experience: '18 years'
    },
    schedule: {
      startDate: new Date('2024-03-05'),
      endDate: new Date('2024-09-05'),
      days: ['Tuesday', 'Thursday'],
      time: '2:00 PM - 4:00 PM',
      mode: 'Hybrid'
    },
    capacity: 28,
    enrolled: 21,
    fees: 899,
    syllabus: [
      {
        week: 1,
        topics: ['Thermodynamic Laws', 'Heat Transfer Modes'],
        assignments: ['Energy Analysis Project']
      }
    ]
  },

  // Civil Engineering Courses
  {
    courseCode: 'CE101',
    title: 'Structural Engineering Basics',
    description: 'Introduction to structural analysis, design principles, construction materials, and building codes.',
    department: 'Civil',
    category: 'Structural Engineering',
    credits: 4,
    duration: '6 Months',
    level: 'Intermediate',
    prerequisites: ['Statics', 'Strength of materials'],
    instructor: {
      name: 'Dr. Maria Garcia',
      email: 'maria.garcia@university.edu',
      qualification: 'PhD in Civil Engineering',
      experience: '13 years'
    },
    schedule: {
      startDate: new Date('2024-02-12'),
      endDate: new Date('2024-08-12'),
      days: ['Monday', 'Wednesday', 'Friday'],
      time: '10:00 AM - 11:30 AM',
      mode: 'Offline'
    },
    capacity: 32,
    enrolled: 26,
    fees: 799,
    syllabus: [
      {
        week: 1,
        topics: ['Structural Systems', 'Load Analysis'],
        assignments: ['Beam Analysis Project']
      }
    ]
  },
  {
    courseCode: 'CE201',
    title: 'Environmental Engineering',
    description: 'Study environmental impact assessment, water treatment, waste management, and sustainable engineering practices.',
    department: 'Civil',
    category: 'Environmental Engineering',
    credits: 3,
    duration: '3 Months',
    level: 'Intermediate',
    prerequisites: ['Chemistry', 'Environmental science basics'],
    instructor: {
      name: 'Prof. Thomas White',
      email: 'thomas.white@university.edu',
      qualification: 'MS in Environmental Engineering',
      experience: '12 years'
    },
    schedule: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-06-01'),
      days: ['Tuesday', 'Thursday'],
      time: '3:00 PM - 4:30 PM',
      mode: 'Hybrid'
    },
    capacity: 25,
    enrolled: 19,
    fees: 649,
    syllabus: [
      {
        week: 1,
        topics: ['Environmental Impact', 'Water Quality'],
        assignments: ['Environmental Assessment']
      }
    ]
  },

  // Additional Advanced Courses
  {
    courseCode: 'CS401',
    title: 'Data Science with Python',
    description: 'Comprehensive data science course covering pandas, numpy, matplotlib, machine learning, and data visualization.',
    department: 'Computer Science',
    category: 'Data Science',
    credits: 4,
    duration: '6 Months',
    level: 'Advanced',
    prerequisites: ['Python programming', 'Statistics', 'Machine learning basics'],
    instructor: {
      name: 'Dr. Kevin Zhang',
      email: 'kevin.zhang@university.edu',
      qualification: 'PhD in Data Science',
      experience: '9 years'
    },
    schedule: {
      startDate: new Date('2024-02-25'),
      endDate: new Date('2024-08-25'),
      days: ['Monday', 'Wednesday'],
      time: '6:00 PM - 8:00 PM',
      mode: 'Online'
    },
    capacity: 35,
    enrolled: 29,
    fees: 999,
    syllabus: [
      {
        week: 1,
        topics: ['Pandas Basics', 'Data Cleaning'],
        assignments: ['Data Analysis Project']
      }
    ]
  },
  {
    courseCode: 'IT301',
    title: 'Network Security',
    description: 'Advanced network security concepts, firewall configuration, intrusion detection, and security protocols.',
    department: 'Information Technology',
    category: 'Network Engineering',
    credits: 4,
    duration: '6 Months',
    level: 'Advanced',
    prerequisites: ['Networking fundamentals', 'Cybersecurity basics'],
    instructor: {
      name: 'Ms. Rachel Thompson',
      email: 'rachel.thompson@university.edu',
      qualification: 'MS in Network Security',
      experience: '11 years'
    },
    schedule: {
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-09-20'),
      days: ['Tuesday', 'Thursday'],
      time: '5:00 PM - 7:00 PM',
      mode: 'Online'
    },
    capacity: 28,
    enrolled: 22,
    fees: 849,
    syllabus: [
      {
        week: 1,
        topics: ['Network Protocols', 'Firewall Configuration'],
        assignments: ['Network Security Assessment']
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/course_registration');
    console.log('✅ Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🗑️  Cleared existing courses');

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log(`✅ Inserted ${sampleCourses.length} sample courses`);

    // Display summary
    const departments = [...new Set(sampleCourses.map(course => course.department))];
    const categories = [...new Set(sampleCourses.map(course => course.category))];
    
    console.log('\n📊 Database Summary:');
    console.log(`   Total Courses: ${sampleCourses.length}`);
    console.log(`   Departments: ${departments.join(', ')}`);
    console.log(`   Categories: ${categories.join(', ')}`);
    console.log(`   Levels: Beginner, Intermediate, Advanced`);
    
    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Configure Google OAuth in .env file');
    console.log('   2. Set admin email in .env file');
    console.log('   3. Start the servers:');
    console.log('      Backend: npm run dev');
    console.log('      Frontend: cd client && npm start');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase();
}

module.exports = { sampleCourses, seedDatabase };