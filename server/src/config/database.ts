import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'internmatch',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Initialize database schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Create a direct connection for initialization
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true
    });
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    await connection.query(`USE \`${dbConfig.database}\``);
    
    // Create tables
    await createTables(connection);
    
    await connection.end();
    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

// Create all tables
const createTables = async (connection: mysql.Connection): Promise<void> => {
  // Users table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'company', 'admin') NOT NULL DEFAULT 'student',
      status ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active',
      avatar VARCHAR(500),
      phone VARCHAR(20),
      location VARCHAR(255),
      bio TEXT,
      website VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_role (role),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Companies table (additional info for company users)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS companies (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      company_name VARCHAR(255) NOT NULL,
      industry VARCHAR(100),
      company_size ENUM('startup', 'small', 'medium', 'large', 'enterprise'),
      description TEXT,
      logo VARCHAR(500),
      website VARCHAR(500),
      founded_year INT,
      headquarters VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_company_name (company_name),
      INDEX idx_industry (industry)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Students table (additional info for student users)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      university VARCHAR(255),
      major VARCHAR(255),
      graduation_year INT,
      gpa DECIMAL(3,2),
      skills TEXT,
      resume VARCHAR(500),
      portfolio VARCHAR(500),
      linkedin VARCHAR(500),
      github VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_university (university),
      INDEX idx_major (major)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Internships table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS internships (
      id INT PRIMARY KEY AUTO_INCREMENT,
      company_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      responsibilities TEXT,
      benefits TEXT,
      location VARCHAR(255) NOT NULL,
      type ENUM('full-time', 'part-time', 'contract', 'remote') NOT NULL,
      duration VARCHAR(100) NOT NULL,
      salary_min DECIMAL(10,2),
      salary_max DECIMAL(10,2),
      salary_type ENUM('hourly', 'monthly', 'stipend', 'unpaid'),
      deadline DATE NOT NULL,
      start_date DATE,
      end_date DATE,
      skills_required TEXT,
      experience_level ENUM('entry', 'intermediate', 'advanced') DEFAULT 'entry',
      is_active BOOLEAN DEFAULT TRUE,
      is_approved BOOLEAN DEFAULT FALSE,
      approved_by INT,
      approved_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
      FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_company_id (company_id),
      INDEX idx_location (location),
      INDEX idx_type (type),
      INDEX idx_is_active (is_active),
      INDEX idx_is_approved (is_approved),
      INDEX idx_deadline (deadline),
      FULLTEXT idx_search (title, description, requirements)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Applications table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS applications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      internship_id INT NOT NULL,
      student_id INT NOT NULL,
      cover_letter TEXT NOT NULL,
      skills TEXT,
      experience TEXT,
      education TEXT,
      portfolio_url VARCHAR(500),
      resume_url VARCHAR(500),
      status ENUM('pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected') DEFAULT 'pending',
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      reviewed_at TIMESTAMP NULL,
      reviewed_by INT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
      UNIQUE KEY unique_application (internship_id, student_id),
      INDEX idx_internship_id (internship_id),
      INDEX idx_student_id (student_id),
      INDEX idx_status (status),
      INDEX idx_applied_at (applied_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Notifications table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      type ENUM('application_update', 'new_internship', 'message', 'system', 'approval', 'rejection') NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
      action_url VARCHAR(500),
      metadata JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_is_read (is_read),
      INDEX idx_type (type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Messages table (for communication between users)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      subject VARCHAR(255),
      content TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_sender_id (sender_id),
      INDEX idx_receiver_id (receiver_id),
      INDEX idx_is_read (is_read),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Skills table (for skill management)
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS skills (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(100) UNIQUE NOT NULL,
      category VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_name (name),
      INDEX idx_category (category)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // User skills junction table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS user_skills (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      skill_id INT NOT NULL,
      proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_skill (user_id, skill_id),
      INDEX idx_user_id (user_id),
      INDEX idx_skill_id (skill_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Insert default admin user
  await connection.execute(`
    INSERT IGNORE INTO users (id, name, email, password, role, status) 
    VALUES (1, 'Admin User', 'admin@internmatch.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2.', 'admin', 'active')
  `);

  // Insert some default skills
  await connection.execute(`
    INSERT IGNORE INTO skills (name, category) VALUES
    ('JavaScript', 'Programming'),
    ('Python', 'Programming'),
    ('React', 'Frontend'),
    ('Node.js', 'Backend'),
    ('MySQL', 'Database'),
    ('MongoDB', 'Database'),
    ('AWS', 'Cloud'),
    ('Docker', 'DevOps'),
    ('Git', 'Version Control'),
    ('TypeScript', 'Programming'),
    ('Java', 'Programming'),
    ('C++', 'Programming'),
    ('HTML/CSS', 'Frontend'),
    ('Vue.js', 'Frontend'),
    ('Angular', 'Frontend'),
    ('Express.js', 'Backend'),
    ('Django', 'Backend'),
    ('Flask', 'Backend'),
    ('PostgreSQL', 'Database'),
    ('Redis', 'Database'),
    ('GraphQL', 'API'),
    ('REST API', 'API'),
    ('Machine Learning', 'AI/ML'),
    ('Data Science', 'AI/ML'),
    ('UI/UX Design', 'Design'),
    ('Figma', 'Design'),
    ('Photoshop', 'Design'),
    ('Project Management', 'Management'),
    ('Agile', 'Methodology'),
    ('Scrum', 'Methodology')
  `);

  // Feedback table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      type ENUM('positive', 'negative') NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_type (type),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Contact messages table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Community discussions table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS discussions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Discussion replies table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS discussion_replies (
      id INT PRIMARY KEY AUTO_INCREMENT,
      discussion_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_discussion_id (discussion_id),
      INDEX idx_user_id (user_id),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Discussion likes table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS discussion_likes (
      id INT PRIMARY KEY AUTO_INCREMENT,
      discussion_id INT NOT NULL,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_like (discussion_id, user_id),
      INDEX idx_discussion_id (discussion_id),
      INDEX idx_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Discussion tags table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS discussion_tags (
      id INT PRIMARY KEY AUTO_INCREMENT,
      discussion_id INT NOT NULL,
      tag_name VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE,
      INDEX idx_discussion_id (discussion_id),
      INDEX idx_tag_name (tag_name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Community events table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS community_events (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      event_date DATE NOT NULL,
      event_time TIME NOT NULL,
      location VARCHAR(255) NOT NULL,
      event_type VARCHAR(100),
      attendees_count INT DEFAULT 0,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_created_by (created_by),
      INDEX idx_event_date (event_date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Community achievements table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS community_achievements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      icon VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // User achievements table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS user_achievements (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      achievement_id INT NOT NULL,
      awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (achievement_id) REFERENCES community_achievements(id) ON DELETE CASCADE,
      UNIQUE KEY unique_user_achievement (user_id, achievement_id),
      INDEX idx_user_id (user_id),
      INDEX idx_achievement_id (achievement_id),
      INDEX idx_awarded_at (awarded_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Insert some default achievements
  await connection.execute(`
    INSERT IGNORE INTO community_achievements (id, title, description, icon) VALUES
    (1, 'First Internship Secured', 'Congratulations on landing your first internship!', 'Trophy'),
    (2, 'Top Contributor', 'Awarded for active participation in community discussions', 'MessageCircle'),
    (3, 'Learning Milestone', 'Completed 10 career development resources', 'BookOpen')
  `);
};

export default pool;
