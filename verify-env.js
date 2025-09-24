// Environment variables verification script
require('dotenv').config();

console.log('🔍 Verifying Environment Variables...\n');

const requiredEnvVars = [
  'MONGODB_URI',
  'PORT',
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'ADMIN_USERNAME',
  'ADMIN_PASSWORD',
  'FRONTEND_URL'
];

let allPresent = true;

console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const isPresent = value !== undefined && value !== '';
  
  if (isPresent) {
    // Hide sensitive values
    const displayValue = ['JWT_SECRET', 'ADMIN_PASSWORD', 'MONGODB_URI'].includes(varName) 
      ? '***HIDDEN***' 
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  }
});

console.log('\n🔧 Configuration Summary:');
console.log(`Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
console.log(`Server Port: ${process.env.PORT || 'Not set'}`);
console.log(`Environment: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`JWT Secret: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
console.log(`Admin Username: ${process.env.ADMIN_USERNAME || 'Not set'}`);
console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'Not set'}`);

if (allPresent) {
  console.log('\n🎉 All environment variables are properly configured!');
  console.log('✅ Ready to start the server');
} else {
  console.log('\n⚠️  Some environment variables are missing!');
  console.log('❌ Please check your .env file');
}

console.log('\n📝 To start the server:');
console.log('npm run dev');
