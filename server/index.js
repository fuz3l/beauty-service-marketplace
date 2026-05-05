import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

app.use(cors());
app.use(express.json());

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashedPassword,
      name,
      role,
    };

    if (role === 'artist') {
      userData.artistProfile = {
        create: {
          isVerified: true, // Auto-verify for development
          location: 'Not specified',
        }
      };
    }

    const user = await prisma.user.create({
      data: userData,
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};

// Get Featured Artists
app.get('/api/artists', async (req, res) => {
  try {
    const isFeatured = req.query.featured === 'true';
    const limit = parseInt(req.query.limit) || 6;
    
    const artists = await prisma.artist.findMany({
      where: {},
      take: limit,
      include: {
        user: { select: { name: true, email: true } },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1
        },
        reviews: { select: { rating: true } }
      }
    });

    const formattedArtists = artists.map(artist => {
      const avgRating = artist.reviews.length > 0 
        ? artist.reviews.reduce((sum, r) => sum + r.rating, 0) / artist.reviews.length 
        : 0;
        
      return {
        id: artist.id,
        name: artist.user.name,
        location: artist.location,
        avatar: artist.avatar,
        speciality: artist.speciality,
        isVerified: artist.isVerified,
        startingPrice: artist.services[0]?.price || null,
        rating: avgRating.toFixed(1),
        reviewCount: artist.reviews.length
      };
    });

    // Sort by rating desc
    formattedArtists.sort((a, b) => b.rating - a.rating);

    res.json({ artists: formattedArtists });
  } catch (error) {
    console.error('Fetch artists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search Artists
app.get('/api/artists/search', async (req, res) => {
  try {
    const { q, location, type } = req.query;

    const whereClause = {}; 

    // Location filter
    if (location && location.trim() !== '') {
      whereClause.location = { contains: location, mode: 'insensitive' };
    }

    // Name or Service filter
    if (q && q.trim() !== '') {
      whereClause.OR = [
        { user: { name: { contains: q, mode: 'insensitive' } } },
        { speciality: { contains: q, mode: 'insensitive' } },
        { services: { some: { title: { contains: q, mode: 'insensitive' } } } }
      ];
    }

    // Category Type filter
    if (type && type.trim() !== '') {
      whereClause.services = { some: { serviceType: { equals: type, mode: 'insensitive' } } };
    }

    const artists = await prisma.artist.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
        services: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1
        },
        reviews: { select: { rating: true } }
      }
    });

    const formattedArtists = artists.map(artist => {
      const avgRating = artist.reviews.length > 0 
        ? artist.reviews.reduce((sum, r) => sum + r.rating, 0) / artist.reviews.length 
        : 0;
        
      return {
        id: artist.id,
        name: artist.user.name,
        location: artist.location,
        avatar: artist.avatar,
        speciality: artist.speciality,
        isVerified: artist.isVerified,
        startingPrice: artist.services[0]?.price || null,
        rating: avgRating.toFixed(1),
        reviewCount: artist.reviews.length
      };
    });

    res.json({ artists: formattedArtists });
  } catch (error) {
    console.error('Search artists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Artist Profile
app.get('/api/artists/:id', async (req, res) => {
  try {
    const artist = await prisma.artist.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true } },
        services: { where: { isActive: true }, orderBy: { price: 'asc' } },
        portfolio: { orderBy: { createdAt: 'desc' } },
        reviews: {
          include: { client: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!artist) return res.status(404).json({ error: 'Artist not found' });

    const avgRating = artist.reviews.length > 0 
      ? artist.reviews.reduce((sum, r) => sum + r.rating, 0) / artist.reviews.length 
      : 0;

    const formattedArtist = {
      id: artist.id,
      name: artist.user.name,
      email: artist.user.email,
      location: artist.location,
      avatar: artist.avatar,
      speciality: artist.speciality,
      isVerified: artist.isVerified,
      rating: avgRating.toFixed(1),
      reviewCount: artist.reviews.length,
      services: artist.services,
      portfolio: artist.portfolio,
      reviews: artist.reviews
    };

    res.json({ artist: formattedArtist });
  } catch (error) {
    console.error('Fetch single artist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Categories
app.get('/api/artists/categories', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: { serviceType: true, artistId: true }
    });

    const categoryMap = {};
    services.forEach(s => {
      const type = s.serviceType.toLowerCase();
      if (!categoryMap[type]) categoryMap[type] = new Set();
      categoryMap[type].add(s.artistId);
    });

    const categories = Object.keys(categoryMap).map(type => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: categoryMap[type].size,
      queryParam: type
    }));

    res.json({ categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const { artistId, serviceId, date, time } = req.body;
    
    if (req.user.role !== 'client') {
       return res.status(403).json({ error: 'Only clients can book services' });
    }

    const booking = await prisma.booking.create({
      data: {
        clientId: req.user.userId,
        artistId,
        serviceId,
        date: new Date(date),
        time,
        status: 'pending'
      }
    });
    
    res.json({ booking });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get My Bookings
app.get('/api/bookings/my', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || undefined;
    const bookings = await prisma.booking.findMany({
      where: { clientId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        service: { select: { title: true, price: true } },
        artist: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    res.json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- ARTIST DASHBOARD ROUTES ---

// Helper middleware to get artist profile
const getArtistProfile = async (req, res, next) => {
  if (req.user.role !== 'artist') return res.status(403).json({ error: 'Not an artist' });
  const artist = await prisma.artist.findUnique({ where: { userId: req.user.userId } });
  if (!artist) return res.status(404).json({ error: 'Artist profile not found' });
  req.artist = artist;
  next();
};

// Get Artist Profile
app.get('/api/artists/profile', authenticateToken, getArtistProfile, (req, res) => {
  res.json({ profile: req.artist });
});

// Update Artist Profile
app.patch('/api/artists/profile', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { location, speciality, avatar, bio } = req.body;
    
    // We update the Artist model. Note: bio/avatar might be in User model depending on schema?
    // Let's check schema: Artist has location, speciality, avatar. User has name, email, avatar.
    // Wait, the schema from earlier: Artist model has avatar, location, speciality.
    const artist = await prisma.artist.update({
      where: { id: req.artist.id },
      data: { location, speciality, avatar } // Add bio if it exists in schema, wait, it doesn't.
    });

    res.json({ artist });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Artist Bookings
app.get('/api/bookings/artist', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { status, limit } = req.query;
    const whereClause = { artistId: req.artist.id };
    if (status) whereClause.status = status.toLowerCase();

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        service: { select: { title: true, price: true } },
        client: { select: { name: true, email: true } }
      }
    });
    res.json({ bookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Booking Status
app.patch('/api/bookings/:id/status', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id, artistId: req.artist.id }, // Note: Prisma may not allow compound where if not unique, wait, id is unique.
      data: { status }
    });
    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get My Services
app.get('/api/services/my', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { artistId: req.artist.id },
      orderBy: { title: 'asc' }
    });
    res.json({ services });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create Service
app.post('/api/services', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { title, serviceType, price } = req.body;
    const service = await prisma.service.create({
      data: {
        artistId: req.artist.id,
        title,
        serviceType,
        price: parseInt(price),
        isActive: true
      }
    });
    res.json({ service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Service
app.patch('/api/services/:id', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { title, price, serviceType, isActive } = req.body;
    
    // Security: Check if artist owns service
    const serviceCheck = await prisma.service.findUnique({ where: { id: req.params.id }});
    if (!serviceCheck || serviceCheck.artistId !== req.artist.id) return res.status(403).json({ error: 'Forbidden' });

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (price !== undefined) updateData.price = parseInt(price);
    if (serviceType !== undefined) updateData.serviceType = serviceType;
    if (isActive !== undefined) updateData.isActive = isActive;

    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: updateData
    });
    res.json({ service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Service
app.delete('/api/services/:id', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const serviceCheck = await prisma.service.findUnique({ where: { id: req.params.id }});
    if (!serviceCheck || serviceCheck.artistId !== req.artist.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.service.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Portfolio Images
app.get('/api/portfolio/my', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const images = await prisma.portfolioImage.findMany({
      where: { artistId: req.artist.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock Upload Portfolio Image
app.post('/api/portfolio/upload', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    const { url } = req.body;
    const imageUrl = url || `https://images.unsplash.com/photo-1512496115851-a1c8515c0e1d?w=800&q=80&${Date.now()}`;
    
    const image = await prisma.portfolioImage.create({
      data: {
        artistId: req.artist.id,
        url: imageUrl
      }
    });
    res.json({ image });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Portfolio Image
app.delete('/api/portfolio/:id', authenticateToken, getArtistProfile, async (req, res) => {
  try {
    // Security: Check ownership
    const imgCheck = await prisma.portfolioImage.findUnique({ where: { id: req.params.id }});
    if (imgCheck.artistId !== req.artist.id) return res.status(403).json({ error: 'Forbidden' });

    await prisma.portfolioImage.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
