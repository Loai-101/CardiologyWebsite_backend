const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const SliderImage = require('./models/SliderImage');
require('dotenv').config();

// Sample slider images data
const sampleSliderImages = [
  {
    title: "Welcome to Cardiology Hospital",
    description: "Your trusted partner in heart health and wellness",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/appointment",
    buttonText: "Book Appointment",
    order: 1,
    isActive: true
  },
  {
    title: "Advanced Heart Care",
    description: "State-of-the-art technology for comprehensive cardiac care",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/services",
    buttonText: "Our Services",
    order: 2,
    isActive: true
  },
  {
    title: "Expert Medical Team",
    description: "Experienced cardiologists dedicated to your heart health",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    link: "/team",
    buttonText: "Meet Our Team",
    order: 3,
    isActive: true
  }
];

// Sample offers data
const sampleOffers = [
  {
    title: "Complete Heart Checkup Package",
    description: "Comprehensive cardiac evaluation including ECG, echocardiogram, stress test, and consultation with our expert cardiologist.",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "package",
    isActive: true,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    features: [
      "ECG (Electrocardiogram)",
      "Echocardiogram",
      "Stress Test",
      "Blood Pressure Monitoring",
      "Consultation with Cardiologist",
      "Detailed Health Report"
    ],
    terms: "Valid for 30 days. Must be used within the validity period."
  },
  {
    title: "Cardiology Consultation",
    description: "One-on-one consultation with our experienced cardiologist to discuss your heart health concerns and get personalized advice.",
    price: 150.00,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "consultation",
    isActive: true,
    features: [
      "45-minute consultation",
      "Medical history review",
      "Physical examination",
      "Personalized treatment plan",
      "Follow-up recommendations"
    ],
    terms: "Appointment required. Cancellation policy applies."
  },
  {
    title: "Heart Health Screening",
    description: "Essential heart health screening including basic tests and risk assessment to help you understand your cardiovascular health.",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "checkup",
    isActive: true,
    validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    features: [
      "Blood pressure check",
      "Cholesterol screening",
      "Blood sugar test",
      "BMI assessment",
      "Heart rate monitoring",
      "Risk factor evaluation"
    ],
    terms: "Fasting required for blood tests. Results available within 24 hours."
  },
  {
    title: "Cardiac Rehabilitation Program",
    description: "Comprehensive 12-week cardiac rehabilitation program designed to improve heart health and overall fitness after cardiac events.",
    price: 899.99,
    originalPrice: 1199.99,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "treatment",
    isActive: true,
    validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    features: [
      "12-week supervised program",
      "Exercise training",
      "Nutrition counseling",
      "Stress management",
      "Medication management",
      "Progress monitoring",
      "Support group access"
    ],
    terms: "Medical clearance required. Program must be completed within 16 weeks."
  },
  {
    title: "Family Heart Health Package",
    description: "Special package for families including heart health screening for up to 4 family members with group discount.",
    price: 599.99,
    originalPrice: 799.99,
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "package",
    isActive: true,
    validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    features: [
      "Up to 4 family members",
      "Basic heart health screening",
      "ECG for all members",
      "Family consultation",
      "Group health report",
      "Follow-up recommendations"
    ],
    terms: "Valid for immediate family members only. All screenings must be completed within 30 days."
  },
  {
    title: "Executive Health Check",
    description: "Comprehensive executive health check designed for busy professionals, including advanced cardiac screening and lifestyle assessment.",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    category: "checkup",
    isActive: true,
    features: [
      "Comprehensive cardiac evaluation",
      "Stress test",
      "Advanced imaging",
      "Executive summary report",
      "Telemedicine follow-up",
      "Priority scheduling",
      "Lifestyle coaching"
    ],
    terms: "Appointment scheduling within 48 hours. Executive lounge access included."
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Offer.deleteMany({});
    await SliderImage.deleteMany({});
    console.log('🗑️ Cleared existing offers and slider images');

    // Insert sample slider images
    const sliderImages = await SliderImage.insertMany(sampleSliderImages);
    console.log(`📸 Inserted ${sliderImages.length} slider images`);

    // Insert sample offers
    const offers = await Offer.insertMany(sampleOffers);
    console.log(`🎁 Inserted ${offers.length} offers`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Slider Images: ${sliderImages.length}`);
    console.log(`- Offers: ${offers.length}`);
    console.log('\n🌐 You can now visit:');
    console.log('- Frontend: http://localhost:3000/offers');
    console.log('- Admin Panel: http://localhost:3000/control-panel');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the seeding function
seedDatabase();
