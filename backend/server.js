const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const path = require('path');

const app = express();

// ✅ 1. Setup session middleware FIRST
app.use(session({
  secret: 'kisanconnectsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // true only for HTTPS
    sameSite: 'lax'
  }
}));

// ✅ 2. Setup CORS to allow frontend to send cookies
app.use(cors({
  origin: ['http://localhost:5500'],
  credentials: true
}));


// ✅ 3. Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 4. Static file serving for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ 5. Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// ✅ File paths
const produceFile = path.join(__dirname, 'produce.json');
const farmersFile = path.join(__dirname, 'farmers.json');

// ✅ Setup multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Register route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const farmers = JSON.parse(fs.readFileSync(farmersFile, 'utf-8') || '[]');

    if (farmers.find(f => f.email === email)) {
      return res.status(400).send('Farmer already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    farmers.push({ name, email, password: hashedPassword });

    fs.writeFileSync(farmersFile, JSON.stringify(farmers, null, 2));
    res.send('Registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Registration failed');
  }
});

// ✅ Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const farmers = JSON.parse(fs.readFileSync(farmersFile, 'utf-8') || '[]');
    const farmer = farmers.find(f => f.email === email);

    if (!farmer || !(await bcrypt.compare(password, farmer.password))) {
      return res.status(401).send('Invalid credentials');
    }

    req.session.farmer = { name: farmer.name, email: farmer.email };
    res.json({ message: 'Login successful', farmer: req.session.farmer });
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed');
  }
});

// ✅ Check session
app.get('/api/me', (req, res) => {
  res.json(req.session.farmer || null);
});

// ✅ Logout
app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out');
});

// ✅ Add produce (POST)
app.post('/api/produce', upload.single('image'), (req, res) => {
  if (!req.session.farmer) return res.status(401).send('Unauthorized');

  const data = JSON.parse(fs.readFileSync(produceFile, 'utf-8') || '[]');

  const item = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    farmerName: req.session.farmer.name,
    location: req.body.location,
    contact: req.body.contact,
    image: req.file ? '/uploads/' + req.file.filename : null
  };

  data.push(item);
  fs.writeFileSync(produceFile, JSON.stringify(data, null, 2));
  res.status(201).send('Produce added');
});

// ✅ View produce (GET)
app.get('/api/produce', (req, res) => {
  let data = JSON.parse(fs.readFileSync(produceFile, 'utf-8') || '[]');
  const { name, category, location } = req.query;

  if (name) data = data.filter(p => p.name.toLowerCase().includes(name.toLowerCase()));
  if (category) data = data.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  if (location) data = data.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));

  res.json(data.reverse());
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
