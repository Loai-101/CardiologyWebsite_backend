const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  const envContent = `# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_${Date.now()}
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_USERNAME=pmi
ADMIN_PASSWORD=123

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional - for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
} else {
  console.log('ℹ️  .env file already exists');
}

// Create .env.example file
const envExampleContent = `# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
JWT_EXPIRE=7d

# Admin Credentials
ADMIN_USERNAME=pmi
ADMIN_PASSWORD=123

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Email Configuration (Optional - for future use)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password`;

fs.writeFileSync(envExamplePath, envExampleContent);
console.log('✅ Created .env.example file');

console.log('\n🚀 Setup complete!');
console.log('📝 Next steps:');
console.log('1. Run: npm install');
console.log('2. Run: npm run dev');
console.log('3. Backend will be available at: http://localhost:5000');
console.log('4. Admin login: username="pmi", password="123"');
