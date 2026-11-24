// server.js - Digital Portfolio Builder Backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const QRCode = require('qrcode');
const db = require('./data/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    if (allowed.test(ext) && (mime.startsWith('image/') || mime === 'image/svg+xml')) {
      return cb(null, true);
    }
    cb(new Error('Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed!'));
  }
});

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static asset folders
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadDir));

// ==========================================
// API ROUTES
// ==========================================

// 1. List all portfolios (for switcher / gallery)
app.get('/api/portfolios', (req, res) => {
  try {
    const portfolios = db.getAllPortfolios();
    const summaries = portfolios.map(p => ({
      id: p.id,
      slug: p.slug,
      fullName: p.profile?.fullName || 'Untitled Portfolio',
      headline: p.profile?.headline || '',
      avatar: p.profile?.avatar || '',
      theme: p.theme || 'modern',
      isPublished: !!p.isPublished,
      projectsCount: p.projects?.length || 0,
      skillsCount: p.skills?.length || 0,
      updatedAt: p.updatedAt
    }));
    res.json({ success: true, count: summaries.length, data: summaries });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Get single portfolio by slug
app.get('/api/portfolios/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = db.getPortfolioBySlug(slug);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: `Portfolio "${slug}" not found.` });
    }
    res.json({ success: true, data: portfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Create a new portfolio
app.post('/api/portfolios', (req, res) => {
  try {
    const { fullName, slug, headline, theme } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required to create a portfolio.' });
    }

    const newPortfolio = db.savePortfolio({
      slug: slug || fullName,
      theme: theme || 'modern',
      profile: {
        fullName: fullName.trim(),
        headline: headline || 'Student & Aspiring Professional',
        avatar: '',
        bio: 'Welcome to my digital portfolio!',
        location: '',
        email: '',
        phone: '',
        website: '',
        availableForHire: true,
        availableNotice: 'Open to opportunities',
        resumeUrl: ''
      },
      skills: [],
      education: [],
      experience: [],
      projects: [],
      isPublished: true
    });

    res.status(201).json({ success: true, data: newPortfolio });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Update an existing portfolio
app.put('/api/portfolios/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const existing = db.getPortfolioBySlug(slug);
    if (!existing) {
      return res.status(404).json({ success: false, error: `Portfolio "${slug}" not found.` });
    }

    const updated = db.savePortfolio({
      ...existing,
      ...req.body,
      id: existing.id // protect original id
    });

    res.json({ success: true, message: 'Portfolio updated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Toggle publish status
app.post('/api/portfolios/:slug/publish', (req, res) => {
  try {
    const { slug } = req.params;
    const existing = db.getPortfolioBySlug(slug);
    if (!existing) {
      return res.status(404).json({ success: false, error: `Portfolio "${slug}" not found.` });
    }

    const isPublished = req.body.isPublished !== undefined ? !!req.body.isPublished : !existing.isPublished;
    const updated = db.savePortfolio({
      ...existing,
      isPublished
    });

    res.json({
      success: true,
      isPublished: updated.isPublished,
      message: updated.isPublished ? 'Portfolio is now published publicly!' : 'Portfolio is now set to draft.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Delete a portfolio
app.delete('/api/portfolios/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const deleted = db.deletePortfolio(slug);
    if (!deleted) {
      return res.status(404).json({ success: false, error: `Portfolio "${slug}" not found.` });
    }
    res.json({ success: true, message: `Portfolio "${slug}" deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Reset or load demo student data
app.post('/api/portfolios/:slug/reset-demo', (req, res) => {
  try {
    const { slug } = req.params;
    const demo = db.resetToDemo(slug);
    res.json({ success: true, message: 'Demo student portfolio loaded successfully!', data: demo });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Contact Form submission (Public facing with validation)
app.post('/api/portfolios/:slug/contact', (req, res) => {
  try {
    const { slug } = req.params;
    const { name, email, subject, message } = req.body;

    const portfolio = db.getPortfolioBySlug(slug);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Target portfolio does not exist.' });
    }

    // Backend Form Validation
    const errors = {};
    if (!name || name.trim().length < 2) {
      errors.name = 'Please provide a valid name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!message || message.trim().length < 5) {
      errors.message = 'Please write a message with at least 5 characters.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, errors, message: 'Form validation failed.' });
    }

    const savedMsg = db.saveMessage({
      portfolioSlug: slug,
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: savedMsg
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. Get messages for portfolio inbox
app.get('/api/portfolios/:slug/messages', (req, res) => {
  try {
    const { slug } = req.params;
    const messages = db.getMessagesBySlug(slug);
    res.json({ success: true, count: messages.length, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 10. Mark message as read
app.patch('/api/messages/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const updated = db.markMessageRead(id, read !== undefined ? read : true);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. Delete message
app.delete('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteMessage(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 12. Upload image file (Profile avatar or Project screenshot)
app.post('/api/upload', (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully.',
      url: fileUrl,
      filename: req.file.filename
    });
  });
});

// 13. Generate QR Code
app.get('/api/qrcode', async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      return res.status(400).json({ success: false, error: 'URL query parameter is required.' });
    }
    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1e1b4b',
        light: '#ffffff'
      }
    });
    res.json({ success: true, qr: qrDataUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 14. Export portfolio as downloadable JSON
app.get('/api/portfolios/:slug/export', (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = db.getPortfolioBySlug(slug);
    if (!portfolio) {
      return res.status(404).json({ success: false, error: 'Portfolio not found.' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${slug}-portfolio-backup.json"`);
    res.send(JSON.stringify(portfolio, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 15. Import portfolio JSON
app.post('/api/import', (req, res) => {
  try {
    const importedData = req.body;
    if (!importedData || !importedData.profile || !importedData.profile.fullName) {
      return res.status(400).json({ success: false, error: 'Invalid portfolio JSON structure.' });
    }

    const saved = db.savePortfolio(importedData);
    res.status(201).json({ success: true, message: 'Portfolio imported successfully!', data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// FRONTEND PAGE ROUTES
// ==========================================

// Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard Studio
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Public Portfolio Viewer (/p/:slug and /portfolio/:slug)
app.get(['/p/:slug', '/portfolio/:slug'], (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

// 404 Handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Digital Portfolio Builder running on port ${PORT}`);
  console.log(`👉 Landing Page:      http://localhost:${PORT}`);
  console.log(`👉 Dashboard Studio:  http://localhost:${PORT}/dashboard`);
  console.log(`👉 Demo Portfolio:    http://localhost:${PORT}/p/alex-morgan`);
  console.log(`=================================================`);
});
