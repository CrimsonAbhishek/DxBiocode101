const assert = require('assert');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting API Integration Tests...');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/../health`);
  const healthData = await healthRes.json();
  console.log('✅ Health check response:', healthData);
  assert.strictEqual(healthData.status, 'ok');

  // 2. Quote submission
  console.log('📬 Testing Quote Request...');
  const quotePayload = {
    name: 'Integration Test User',
    email: 'integration-test@example.com',
    phone: '9876543210',
    organization: 'Test Lab Corp',
    designation: 'Director',
    facilityType: 'Diagnostic Laboratory',
    timeline: 'Immediate (Within 30 Days)',
    message: 'Integration test message for quotes.',
    items: [
      { product_name: 'DX 101 Immunofluorescence Quantitative Analyzer', quantity: 1 }
    ]
  };

  const quoteRes = await fetch(`${BASE_URL}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quotePayload)
  });
  const quoteData = await quoteRes.json();
  console.log('✅ Quote submission response:', quoteData);
  assert.strictEqual(quoteRes.status, 201);
  assert.strictEqual(quoteData.success, true);

  // 3. Contact submission
  console.log('📬 Testing Contact Enquiry...');
  const contactPayload = {
    name: 'Contact Test Bot',
    email: 'contact-test@example.com',
    phone: '1234567890',
    organization: 'Test Org',
    enquiryType: 'General Information',
    message: 'Integration test message for contact.'
  };

  const contactRes = await fetch(`${BASE_URL}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload)
  });
  const contactData = await contactRes.json();
  console.log('✅ Contact submission response:', contactData);
  assert.strictEqual(contactRes.status, 201);
  assert.strictEqual(contactData.success, true);

  // 4. Training request submission
  console.log('📬 Testing Training Request...');
  const trainingPayload = {
    name: 'Training Test Bot',
    email: 'training-test@example.com',
    phone: '5556667777',
    location: 'Chennai',
    organization: 'Apollo Hospitals',
    trainingCategory: 'DX 101 Training',
    message: 'Training integration test message.'
  };

  const trainingRes = await fetch(`${BASE_URL}/training`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trainingPayload)
  });
  const trainingData = await trainingRes.json();
  console.log('✅ Training response:', trainingData);
  assert.strictEqual(trainingRes.status, 201);
  assert.strictEqual(trainingData.success, true);

  // 5. Careers submission (Multipart Mock)
  console.log('📬 Testing Careers Application...');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const multipartBody = [
    `--${boundary}`,
    'Content-Disposition: form-data; name="firstName"',
    '',
    'TestFirst',
    `--${boundary}`,
    'Content-Disposition: form-data; name="lastName"',
    '',
    'TestLast',
    `--${boundary}`,
    'Content-Disposition: form-data; name="email"',
    '',
    'career-test@example.com',
    `--${boundary}`,
    'Content-Disposition: form-data; name="phone"',
    '',
    '9998887777',
    `--${boundary}`,
    'Content-Disposition: form-data; name="position"',
    '',
    'Bio-Medical Engineer',
    `--${boundary}`,
    'Content-Disposition: form-data; name="experience"',
    '',
    '3-5 years',
    `--${boundary}`,
    'Content-Disposition: form-data; name="coverLetter"',
    '',
    'Cover letter integration test text.',
    `--${boundary}`,
    'Content-Disposition: form-data; name="resume"; filename="resume.pdf"',
    'Content-Type: application/pdf',
    '',
    '%PDF-1.4 Mock PDF Resume Content',
    `--${boundary}--`
  ].join('\r\n');

  const careerRes = await fetch(`${BASE_URL}/careers`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody
  });
  const careerData = await careerRes.json();
  console.log('✅ Career application response:', careerData);
  assert.strictEqual(careerRes.status, 201);
  assert.strictEqual(careerData.success, true);

  // 6. Verify fallback database content
  console.log('🔍 Verifying db.json contents...');
  const dbJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'db.json'), 'utf-8'));
  assert(dbJson.quotes.length > 0, 'No quotes saved in db.json');
  assert(dbJson.contacts.length > 0, 'No contacts saved in db.json');
  assert(dbJson.training_requests.length > 0, 'No training requests saved in db.json');
  assert(dbJson.career_applications.length > 0, 'No career applications saved in db.json');
  console.log('🎉 All API Integration Tests Passed Successfully!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
