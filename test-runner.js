// test-runner.js - Automated integration test runner
const http = require('http');

async function runTests() {
  console.log('--- Starting Integration Test Suite ---');
  
  // Start server
  const server = require('./server');
  // Give server 500ms to bind
  await new Promise(r => setTimeout(r, 600));

  const BASE = 'http://127.0.0.1:3000';
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // Test 1: GET /api/portfolios
  await test('GET /api/portfolios', async () => {
    const res = await fetch(`${BASE}/api/portfolios`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error('Expected array of portfolios');
    }
  });

  // Test 2: GET /api/portfolios/alex-morgan
  await test('GET /api/portfolios/alex-morgan', async () => {
    const res = await fetch(`${BASE}/api/portfolios/alex-morgan`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.slug !== 'alex-morgan' || !data.data.profile.fullName) {
      throw new Error('Invalid portfolio profile payload');
    }
  });

  // Test 3: POST /api/portfolios (create new portfolio)
  let testSlug = `test-user-${Date.now()}`;
  await test('POST /api/portfolios (Create)', async () => {
    const res = await fetch(`${BASE}/api/portfolios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test Student',
        slug: testSlug,
        headline: 'Biomedical Engineering Undergrad',
        theme: 'creative'
      })
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    if (!json.success || json.data.slug !== testSlug) throw new Error('Create failed');
  });

  // Test 4: PUT /api/portfolios/:slug (Update)
  await test(`PUT /api/portfolios/${testSlug} (Update)`, async () => {
    const res = await fetch(`${BASE}/api/portfolios/${testSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile: {
          fullName: 'Test Student Updated',
          headline: 'Updated Bioengineering Student'
        }
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.profile.fullName !== 'Test Student Updated') {
      throw new Error('Update did not reflect');
    }
  });

  // Test 5: POST /api/portfolios/alex-morgan/contact (Valid Submission)
  await test('POST /api/portfolios/alex-morgan/contact (Valid form)', async () => {
    const res = await fetch(`${BASE}/api/portfolios/alex-morgan/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Recruiter Jane',
        email: 'jane.recruiter@stripe.com',
        subject: 'Frontend Internship 2026',
        message: 'Hi Alex, we would love to invite you for an interview.'
      })
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const json = await res.json();
    if (!json.success || !json.data.id) throw new Error('Missing contact message ID');
  });

  // Test 6: POST /api/portfolios/alex-morgan/contact (Server Validation Check)
  await test('POST /api/portfolios/alex-morgan/contact (Validation rejects invalid input)', async () => {
    const res = await fetch(`${BASE}/api/portfolios/alex-morgan/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'A', // too short (< 2 chars)
        email: 'bad-email-format',
        message: 'hi' // too short (< 5 chars)
      })
    });
    if (res.status !== 400) throw new Error(`Expected 400 Bad Request, got ${res.status}`);
    const json = await res.json();
    if (!json.errors || !json.errors.name || !json.errors.email || !json.errors.message) {
      throw new Error('Expected field validation error details');
    }
  });

  // Test 7: GET /api/portfolios/alex-morgan/messages (Inbox)
  await test('GET /api/portfolios/alex-morgan/messages', async () => {
    const res = await fetch(`${BASE}/api/portfolios/alex-morgan/messages`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      throw new Error('Expected list of messages');
    }
  });

  // Test 8: GET /api/qrcode
  await test('GET /api/qrcode', async () => {
    const res = await fetch(`${BASE}/api/qrcode?url=${encodeURIComponent('http://localhost:3000/p/alex-morgan')}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.qr || !json.qr.startsWith('data:image/png;base64,')) {
      throw new Error('Expected valid base64 QR code image');
    }
  });

  // Test 9: GET /api/portfolios/alex-morgan/export
  await test('GET /api/portfolios/alex-morgan/export', async () => {
    const res = await fetch(`${BASE}/api/portfolios/alex-morgan/export`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.slug !== 'alex-morgan') throw new Error('Expected exported JSON');
  });

  // Test 10: GET Landing Page HTML
  await test('GET / (Landing page)', async () => {
    const res = await fetch(`${BASE}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('Launch Studio') || !html.includes('Student Portfolio')) {
      throw new Error('Landing page content missing');
    }
  });

  // Test 11: GET Dashboard HTML
  await test('GET /dashboard (Studio dashboard)', async () => {
    const res = await fetch(`${BASE}/dashboard`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('app-sidebar') || !html.includes('live-preview') && !html.includes('Live Preview')) {
      throw new Error('Dashboard structure missing');
    }
  });

  // Test 12: GET Public Portfolio HTML
  await test('GET /p/alex-morgan (Public portfolio page)', async () => {
    const res = await fetch(`${BASE}/p/alex-morgan`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    if (!html.includes('portfolio-root')) {
      throw new Error('Public portfolio container missing');
    }
  });

  // Clean up test portfolio
  await test(`DELETE /api/portfolios/${testSlug} (Clean up)`, async () => {
    const res = await fetch(`${BASE}/api/portfolios/${testSlug}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  });

  console.log('\n=============================================');
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log('=============================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
