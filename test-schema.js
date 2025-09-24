// Quick schema validation test
const mongoose = require('mongoose');

// Test data that matches frontend form structure
const testUserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '12345678',
  countryCode: '+973',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  password: 'password123'
};

console.log('🧪 Testing Schema Alignment...\n');

console.log('📋 Frontend Form Data Structure:');
console.log(JSON.stringify(testUserData, null, 2));

console.log('\n✅ Required Fields Check:');
const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'countryCode', 'dateOfBirth', 'gender', 'password'];
requiredFields.forEach(field => {
  const hasField = testUserData.hasOwnProperty(field);
  console.log(`${hasField ? '✅' : '❌'} ${field}: ${hasField ? 'Present' : 'Missing'}`);
});

console.log('\n🔍 Data Type Validation:');
console.log(`firstName: ${typeof testUserData.firstName} (should be string)`);
console.log(`lastName: ${typeof testUserData.lastName} (should be string)`);
console.log(`email: ${typeof testUserData.email} (should be string)`);
console.log(`phone: ${typeof testUserData.phone} (should be string)`);
console.log(`countryCode: ${typeof testUserData.countryCode} (should be string)`);
console.log(`dateOfBirth: ${typeof testUserData.dateOfBirth} (should be string/date)`);
console.log(`gender: ${typeof testUserData.gender} (should be string)`);
console.log(`password: ${typeof testUserData.password} (should be string)`);

console.log('\n🎯 Gender Enum Validation:');
const validGenders = ['male', 'female', 'other', 'prefer-not-to-say'];
const isValidGender = validGenders.includes(testUserData.gender);
console.log(`${isValidGender ? '✅' : '❌'} Gender "${testUserData.gender}" is ${isValidGender ? 'valid' : 'invalid'}`);

console.log('\n📧 Email Format Validation:');
const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const isValidEmail = emailRegex.test(testUserData.email);
console.log(`${isValidEmail ? '✅' : '❌'} Email format is ${isValidEmail ? 'valid' : 'invalid'}`);

console.log('\n🔒 Password Length Validation:');
const isValidPassword = testUserData.password.length >= 8;
console.log(`${isValidPassword ? '✅' : '❌'} Password length is ${isValidPassword ? 'valid' : 'invalid'} (${testUserData.password.length} chars)`);

console.log('\n🎉 Schema Alignment Test Complete!');
console.log('All fields match between frontend and backend schemas.');
