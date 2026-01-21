 // server.cjs  
const express = require('express');
const cors = require('cors');
const connectDB = require('./db.cjs');
require('dotenv').config();

const Analytics = require('./models/Analytics.cjs');
const { generalLimiter, authLimiter, adminLimiter, apiLimiter } = require('./middleware/rateLimit.cjs');

// IMPORT MIDDLEWARE AND ROUTES
const adminAuth = require('./middleware/adminAuth.cjs');
const animeRoutes = require('./routes/animeRoutes.cjs');
const episodeRoutes = require('./routes/episodeRoutes.cjs');
const chapterRoutes = require('./routes/chapterRoutes.cjs');
const reportRoutes = require('./routes/reportRoutes.cjs');
const socialRoutes = require('./routes/socialRoutes.cjs');
const appDownloadRoutes = require('./routes/appDownloadRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');
const contactRoutes = require('./routes/contactRoutes.cjs');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database Connection
connectDB();

// RATE LIMITING MIDDLEWARE
app.use('/api/', apiLimiter);
app.use('/api/admin/login', authLimiter);
app.use('/api/admin/protected', adminLimiter);

// ANALYTICS TRACKING MIDDLEWARE
app.use((req, res, next) => {
  if (req.path === '/' || 
      req.path.includes('/anime') || 
      req.path.includes('/api/anime') ||
      req.path.includes('/search')) {
    Analytics.recordVisit(req, 0);
  }
  next();
});

// DYNAMIC SITEMAP GENERATOR  
app.get('/sitemap.xml', async (req, res) => {
  try {
    console.log('🗺️ Generating SEO optimized sitemap.xml for AnimeStar...');
    
    const Anime = require('./models/Anime.cjs');
    
    // Get all anime with SEO fields
    const allAnime = await Anime.find({})
      .select('slug seoTitle thumbnail updatedAt contentType subDubStatus releaseYear')
      .lean();
    
    // Start building XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n`;
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    // STATIC PAGES ONLY (SEO SAFE)
    const staticPages = [
      { url: 'https://animestar.in', priority: '1.0', changefreq: 'daily' },
      { url: 'https://animestar.in/anime', priority: '0.9', changefreq: 'daily' },
      { url: 'https://animestar.in/anime?filter=Hindi%20Dub', priority: '0.8', changefreq: 'weekly' },
      { url: 'https://animestar.in/anime?filter=Hindi%20Sub', priority: '0.8', changefreq: 'weekly' },
      { url: 'https://animestar.in/anime?filter=English%20Sub', priority: '0.8', changefreq: 'weekly' },
      { url: 'https://animestar.in/privacy', priority: '0.5', changefreq: 'monthly' },
      { url: 'https://animestar.in/terms', priority: '0.5', changefreq: 'monthly' },
      { url: 'https://animestar.in/dmca', priority: '0.5', changefreq: 'monthly' },
      { url: 'https://animestar.in/contact', priority: '0.5', changefreq: 'monthly' }
    ];
    
    // Add static pages
    staticPages.forEach(page => {
      xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });
    
    // CATEGORY PAGES (SEO FRIENDLY)
    const categoryPages = [
      { url: 'https://animestar.in/detail?contentType=Movie', priority: '0.7', changefreq: 'weekly' },
      { url: 'https://animestar.in/detail?contentType=Manga', priority: '0.7', changefreq: 'weekly' }
    ];
    
    categoryPages.forEach(page => {
      xml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });
    
    // DYNAMIC ANIME PAGES  
    console.log(`📺 Adding ${allAnime.length} anime to sitemap...`);
    
    allAnime.forEach(anime => {
      if (anime.slug || anime._id) {
        const lastmod = anime.updatedAt ? 
          new Date(anime.updatedAt).toISOString().split('T')[0] : 
          currentDate;
        
        const animeSlug = anime.slug || anime._id.toString();
        const animeUrl = `https://animestar.in/detail/${animeSlug}`;
        
        xml += `  <url>
    <loc>${animeUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>\n`;
        
        // Add image if available
        if (anime.thumbnail) {
          xml += `    <image:image>
      <image:loc>${anime.thumbnail}</image:loc>
      <image:title><![CDATA[${anime.seoTitle || anime.title}]]></image:title>
    </image:image>\n`;
        }
        
        // Add video info if it's a movie
        if (anime.contentType === 'Movie') {
          xml += `    <video:video>
      <video:title><![CDATA[${anime.title}]]></video:title>
      <video:description><![CDATA[Watch ${anime.title} online in ${anime.subDubStatus || 'HD quality'} on AnimeStar]]></video:description>
      <video:thumbnail_loc>${anime.thumbnail || ''}</video:thumbnail_loc>
      <video:release_date>${anime.releaseYear || currentDate.split('-')[0]}-01-01</video:release_date>
    </video:video>\n`;
        }
        
        xml += `  </url>\n`;
      }
    });
    
    xml += '</urlset>';
    
    // Set headers and send response
    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(xml);
    
    console.log(`✅ SEO Safe Sitemap generated with ${allAnime.length + staticPages.length + categoryPages.length} URLs`);
    console.log(`⚠️ IMPORTANT: Search query URLs REMOVED to avoid Google penalties`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    
    // Fallback to minimal sitemap if dynamic fails
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://animestar.in</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(fallbackSitemap);
  }
});

// ROBOTS.TXT (For SEO)
app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Sitemap: https://animestar.in/sitemap.xml

# SEO Instructions for Google
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Block bad bots
User-agent: AhrefsBot
Disallow: /
User-agent: SemrushBot
Disallow: /

# SEO Sitemaps
Sitemap: https://animestar.in/sitemap.xml
Sitemap: https://animestar.in/rss.xml`;
  
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// RSS FEED FOR SEO
app.get('/rss.xml', async (req, res) => {
  try {
    const Anime = require('./models/Anime.cjs');
    
    const recentAnime = await Anime.find({})
      .select('title description thumbnail slug seoDescription updatedAt')
      .sort({ updatedAt: -1 })
      .limit(20)
      .lean();
    
    const currentDate = new Date().toUTCString();
    
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AnimeStar - Latest Anime Updates</title>
    <link>https://animestar.in</link>
    <description>Watch anime online in Hindi and English. Latest anime episodes and movies on AnimeStar.</description>
    <language>en-us</language>
    <pubDate>${currentDate}</pubDate>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="https://animestar.in/rss.xml" rel="self" type="application/rss+xml" />\n`;
    
    recentAnime.forEach(anime => {
      const pubDate = anime.updatedAt ? new Date(anime.updatedAt).toUTCString() : currentDate;
      const description = anime.seoDescription || anime.description || `Watch ${anime.title} online on AnimeStar`;
      const animeSlug = anime.slug || anime._id;
      
      rss += `    <item>
      <title><![CDATA[${anime.title}]]></title>
      <link>https://animestar.in/detail/${animeSlug}</link>
      <guid>https://animestar.in/detail/${animeSlug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      <enclosure url="${anime.thumbnail || ''}" type="image/jpeg" />
    </item>\n`;
    });
    
    rss += `  </channel>
</rss>`;
    
    res.header('Content-Type', 'application/xml');
    res.send(rss);
    
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).send('Error generating RSS feed');
  }
});

// FIXED ADMIN CREATION FUNCTION  
const createAdmin = async () => {
  try {
    const Admin = require('./models/Admin.cjs');
    const bcrypt = require('bcryptjs');
    
    // Username ko 'admin' karo  
    const username = process.env.ADMIN_USER || 'admin';   
    const password = process.env.ADMIN_PASS || 'Anime2121818144';
    
    console.log('🔄 Checking admin user...');
    
    let admin = await Admin.findOne({ username });
    
    if (!admin) {
      console.log('🆕 Creating new admin user...');
      const hashedPassword = await bcrypt.hash(password, 12);
      
      admin = await Admin.create({
        username: username,
        password: hashedPassword,
        email: 'admin@animestar.in',
        role: 'admin'
      });
      
      console.log('✅ Admin user created successfully!');
    } else {
      console.log('✅ Admin user already exists');
      
      // Update password to ensure it's correct
      const hashedPassword = await bcrypt.hash(password, 12);
      admin.password = hashedPassword;
      await admin.save();
      console.log('🔁 Admin password updated');
    }
    
    console.log('=================================');
    console.log('🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('   Username:', username);
    console.log('   Password:', password);
    console.log('   Login URL: http://localhost:5173');
    console.log('   Press Ctrl+Shift+Alt for admin button');
    console.log('=================================');
    
  } catch (err) {
    console.error('❌ ADMIN CREATION ERROR:', err);
    console.log('💡 TROUBLESHOOTING:');
    console.log('1. Check MongoDB connection');
    console.log('2. Check bcrypt installation: npm install bcryptjs');
    console.log('3. Check environment variables in .env file');
  }
};
createAdmin();

// EMERGENCY ADMIN RESET ROUTE
app.get('/api/admin/emergency-reset', async (req, res) => {
  try {
    const Admin = require('./models/Admin.cjs');
    const bcrypt = require('bcryptjs');
    
    console.log('🆕 EMERGENCY ADMIN RESET INITIATED...');
    
    // Delete any existing admin
    await Admin.deleteMany({});
    console.log('✅ Cleared existing admin users');
    
    // Create new admin with hashed password
    const hashedPassword = await bcrypt.hash('Anime2121818144', 12);
    const admin = new Admin({
      username: 'admin',  // Yahaan bhi 'admin' karo
      password: hashedPassword,
      email: 'admin@animestar.in',
      role: 'superadmin'
    });
    
    await admin.save();
    console.log('✅ EMERGENCY ADMIN CREATED SUCCESSFULLY!');
    
    res.json({ 
      success: true, 
      message: '✅ EMERGENCY: Admin account created successfully!',
      credentials: {
        username: 'admin',
        password: 'Anime2121818144'
      },
      instructions: 'Use these credentials to login at /admin route'
    });
    
  } catch (error) {
    console.error('❌ EMERGENCY ADMIN RESET ERROR:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Check MongoDB connection and bcrypt installation'
    });
  }
});

// ADMIN DEBUG ROUTE
app.get('/api/admin/debug', async (req, res) => {
  try {
    const Admin = require('./models/Admin.cjs');
    
    const adminCount = await Admin.countDocuments();
    const allAdmins = await Admin.find().select('username email createdAt');
    
    console.log('🔍 ADMIN DEBUG INFO:');
    console.log('Total Admins:', adminCount);
    console.log('Admin List:', allAdmins);
    
    res.json({
      success: true,
      totalAdmins: adminCount,
      admins: allAdmins,
      serverTime: new Date().toISOString(),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development'
    });
    
  } catch (error) {
    console.error('Admin debug error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// EMERGENCY ADMIN CREATION ROUTE
app.get('/api/admin/create-default-admin', async (req, res) => {
  try {
    const Admin = require('./models/Admin.cjs');
    const bcrypt = require('bcryptjs');
    
    console.log('🆕 EMERGENCY: Creating default admin user...');
    
    // Delete existing admin if any
    await Admin.deleteMany({ username: 'admin' });  // Yahaan bhi 'admin'
    
    // Create new admin
    const hashedPassword = await bcrypt.hash('Anime2121818144', 12);
    const admin = new Admin({
      username: 'admin',  // Yahaan bhi 'admin'
      password: hashedPassword,
      email: 'admin@animestar.com',
      role: 'admin'
    });
    
    await admin.save();
    
    console.log('✅ EMERGENCY ADMIN CREATED:', admin.username);
    
    res.json({ 
      success: true, 
      message: '✅ EMERGENCY: Admin created successfully!',
      credentials: {
        username: 'admin',
        password: 'Anime2121818144'
      },
      instructions: 'Use these credentials to login at your frontend admin panel'
    });
  } catch (error) {
    console.error('❌ EMERGENCY Admin creation error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      stack: error.stack 
    });
  }
});

// FIXED ADMIN LOGIN ROUTE
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('\n🔐 LOGIN ATTEMPT:', { 
      username, 
      hasPassword: !!password,
      timestamp: new Date().toISOString()
    });
    
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        error: 'Username and password required' 
      });
    }

    const Admin = require('./models/Admin.cjs');
    const bcrypt = require('bcryptjs');
    
    // Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('❌ Admin not found:', username);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }

    console.log('🔑 Admin found, comparing passwords...');
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('✅ Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid username or password' 
      });
    }

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        id: admin._id, 
        username: admin.username,
        role: admin.role 
      }, 
      process.env.JWT_SECRET || 'supersecretkey', 
      { expiresIn: '24h' }
    );

    console.log('🎉 LOGIN SUCCESSFUL for:', username);
    
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      username: admin.username,
      role: admin.role
    });
    
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during login' 
    });
  }
});

// App downloads API
app.get('/api/app-downloads', async (req, res) => {
  try {
    const AppDownload = require('./models/AppDownload.cjs');
    const appDownloads = await AppDownload.find({ isActive: true });
    res.json(appDownloads);
  } catch (error) {
    console.error('App downloads API error:', error);
    res.json([]);
  }
});

// EPISODES BY ANIME ID ROUTE  
app.get('/api/episodes/:animeId', async (req, res) => {
  try {
    const { animeId } = req.params;
    console.log('📺 Fetching episodes for anime:', animeId);
    
    const Episode = require('./models/Episode.cjs');
    const episodes = await Episode.find({ animeId }).sort({ session: 1, episodeNumber: 1 });
    
    console.log(`✅ Found ${episodes.length} episodes for anime ${animeId}`);
    res.json(episodes);
  } catch (error) {
    console.error('Episodes fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// PROTECTED ADMIN ROUTES
// ============================================
app.use('/api/admin/protected', adminAuth, adminRoutes);

// ============================================
// PUBLIC ROUTES - CORRECTED ORDER
// ============================================
// SOCIAL MEDIA ROUTES MUST COME BEFORE ADMIN ROUTES FOR /admin paths
app.use('/api/social', socialRoutes);

// Other routes
app.use('/api/anime', animeRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/app-downloads', appDownloadRoutes);
app.use('/api', contactRoutes);

// ============================================
// DEBUG ROUTES (KEEP FOR TROUBLESHOOTING)
// ============================================
app.get('/api/debug/episodes', async (req, res) => {
  try {
    const Episode = require('./models/Episode.cjs');
    const Anime = require('./models/Anime.cjs');
    
    const allEpisodes = await Episode.find().populate('animeId', 'title');
    
    console.log('📋 ALL EPISODES IN DATABASE:');
    allEpisodes.forEach(ep => {
      console.log(`- ${ep.animeId?.title || 'NO ANIME'} | EP ${ep.episodeNumber} | Session ${ep.session} | AnimeID: ${ep.animeId?._id}`);
    });
    
    res.json({
      totalEpisodes: allEpisodes.length,
      episodes: allEpisodes
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/anime/:animeId', async (req, res) => {
  try {
    const Anime = require('./models/Anime.cjs');
    const Episode = require('./models/Episode.cjs');
    
    const animeId = req.params.animeId;
    const anime = await Anime.findById(animeId);
    const episodes = await Episode.find({ animeId });
    
    console.log('🔍 DEBUG ANIME:');
    console.log('Anime Title:', anime?.title);
    console.log('Anime ID:', anime?._id);
    console.log('Requested ID:', animeId);
    console.log('Episodes found:', episodes.length);
    
    res.json({
      anime: anime,
      episodes: episodes,
      animeId: animeId,
      episodesCount: episodes.length
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/debug/animes', async (req, res) => {
  try {
    const Anime = require('./models/Anime.cjs');
    const animes = await Anime.find().select('title _id contentType');
    
    console.log('📺 ALL ANIMES IN DATABASE:');
    animes.forEach(anime => {
      console.log(`- ${anime.title} | ID: ${anime._id} | Type: ${anime.contentType}`);
    });
    
    res.json({
      totalAnimes: animes.length,
      animes: animes
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// SOCIAL MEDIA DEBUG ROUTE
app.get('/api/debug/social', async (req, res) => {
  try {
    const SocialMedia = require('./models/SocialMedia.cjs');
    
    const allLinks = await SocialMedia.find().sort({ platform: 1 });
    const activeLinks = await SocialMedia.find({ isActive: true });
    
    console.log('🔗 SOCIAL MEDIA DEBUG:');
    console.log('Total Links:', allLinks.length);
    console.log('Active Links:', activeLinks.length);
    
    allLinks.forEach(link => {
      console.log(`- ${link.platform}: ${link.url} [${link.isActive ? 'Active' : 'Inactive'}]`);
    });
    
    res.json({
      success: true,
      totalLinks: allLinks.length,
      activeLinks: activeLinks.length,
      allLinks: allLinks,
      activeLinks: activeLinks
    });
  } catch (error) {
    console.error('Social media debug error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

// HEALTH CHECK WITH SEO INFO
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AnimeStar Server Running - SEO OPTIMIZED',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    seoFeatures: {
      sitemap: 'https://animestar.in/sitemap.xml',
      robots: 'https://animestar.in/robots.txt',
      rssFeed: 'https://animestar.in/rss.xml',
      dynamicUrls: 'Enabled',
      structuredData: 'Enabled'
    },
    seoWarning: '✅ Search query URLs REMOVED from sitemap to avoid Google penalties'
  });
});

// EMERGENCY: SET ALL ANIME AS FEATURED ROUTE
app.get('/api/emergency/set-all-featured', async (req, res) => {
  try {
    const Anime = require('./models/Anime.cjs');
    
    console.log('🆕 EMERGENCY: Setting ALL anime as featured...');
    
    const result = await Anime.updateMany(
      {}, 
      { 
        $set: { 
          featured: true,
          featuredOrder: 1 
        } 
      }
    );
    
    console.log(`✅ Set ${result.modifiedCount} anime as featured`);
    
    const featuredAnime = await Anime.find({ featured: true })
      .select('title featured featuredOrder')
      .limit(10)
      .lean();
    
    res.json({ 
      success: true, 
      message: `Set ${result.modifiedCount} anime as featured`,
      modifiedCount: result.modifiedCount,
      sampleFeatured: featuredAnime
    });
    
  } catch (error) {
    console.error('❌ Emergency featured error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// EMERGENCY: FIX FEATURED ANIME BY SETTING RANDOM ANIME AS FEATURED
app.get('/api/emergency/fix-featured-anime', async (req, res) => {
  try {
    const Anime = require('./models/Anime.cjs');
    
    console.log('🆕 EMERGENCY: Fixing featured anime...');
    
    // Pehle sabhi anime ko featured: false karo
    await Anime.updateMany({}, { 
      $set: { 
        featured: false,
        featuredOrder: 0 
      } 
    });
    
    console.log('✅ All anime reset to not-featured');
    
    // Check karo kitne anime hain database mein
    const totalAnime = await Anime.countDocuments();
    
    if (totalAnime === 0) {
      console.log('❌ Database mein koi anime nahi hai');
      return res.json({ 
        success: false, 
        message: 'Database mein koi anime nahi hai. Pehle anime add karo.',
        totalAnime: 0
      });
    }
    
    console.log(`📊 Total anime in database: ${totalAnime}`);
    
    // Agar kam se kam 5 anime hain toh unhein featured mark karo
    const limit = Math.min(totalAnime, 10);
    
    // First 5 anime select karo
    const animeToFeature = await Anime.find()
      .select('_id title')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    const animeIds = animeToFeature.map(a => a._id);
    
    console.log(`🎯 Attempting to set ${animeIds.length} anime as featured...`);
    
    // Un anime ko featured mark karo
    for (let i = 0; i < animeIds.length; i++) {
      await Anime.findByIdAndUpdate(animeIds[i], {
        $set: {
          featured: true,
          featuredOrder: i + 1
        }
      });
      console.log(`✅ Set anime #${i + 1} as featured`);
    }
    
    console.log(`✅ Successfully set ${animeIds.length} anime as featured`);
    
    // Featured anime get karke return karo
    const featuredAnime = await Anime.find({ featured: true })
      .select('title thumbnail featured featuredOrder subDubStatus contentType')
      .sort({ featuredOrder: 1 })
      .lean();
    
    res.json({ 
      success: true, 
      message: `✅ EMERGENCY: Set ${animeIds.length} anime as featured!`,
      totalAnime: totalAnime,
      featuredCount: featuredAnime.length,
      featuredAnime: featuredAnime,
      instructions: 'Now refresh your homepage to see featured anime'
    });
    
  } catch (error) {
    console.error('❌ Emergency featured fix error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      stack: error.stack
    });
  }
});

// EMERGENCY: RESET SOCIAL MEDIA LINKS
app.get('/api/emergency/reset-social', async (req, res) => {
  try {
    const SocialMedia = require('./models/SocialMedia.cjs');
    
    console.log('🆕 EMERGENCY: Resetting social media links...');
    
    // Delete all existing social media links
    await SocialMedia.deleteMany({});
    
    // Initialize default links
    await SocialMedia.initDefaultLinks();
    
    const links = await SocialMedia.find().sort({ platform: 1 });
    
    console.log('✅ Social media links reset to defaults');
    
    res.json({
      success: true,
      message: 'Social media links reset to default (Facebook, Instagram, Telegram)',
      links: links
    });
  } catch (error) {
    console.error('❌ Social media reset error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// EMERGENCY: FIX SOCIAL MEDIA LINKS WITH CORRECT URLS  
app.get('/api/emergency/fix-social-urls', async (req, res) => {
  try {
    const SocialMedia = require('./models/SocialMedia.cjs');
    
    console.log('🆕 EMERGENCY: Fixing social media links with correct URLs for AnimeStar...');
    
    // Delete all existing social media links
    await SocialMedia.deleteMany({});
    
    // CORRECT LINKS for AnimeStar with proper formatting
    const correctLinks = [
      {
        platform: 'instagram',
        url: 'https://instagram.com/animestarofficial', // AnimeStar Instagram
        isActive: true,
        icon: 'instagram',
        displayName: 'Instagram'
      },
      {
        platform: 'telegram', 
        url: 'https://t.me/animestarofficial', // AnimeStar Telegram
        isActive: true,
        icon: 'telegram',
        displayName: 'Telegram'
      },
      {
        platform: 'facebook',
        url: 'https://facebook.com/animestarofficial', // AnimeStar Facebook page
        isActive: true,
        icon: 'facebook',
        displayName: 'Facebook'
      }
    ];
    
    // Insert the correct links
    await SocialMedia.insertMany(correctLinks);
    console.log('✅ Inserted CORRECTED social media links for AnimeStar');
    
    // Verify
    const allLinks = await SocialMedia.find().sort({ platform: 1 });
    
    res.json({
      success: true,
      message: '✅ EMERGENCY: Social media links fixed with CORRECT URLs for AnimeStar!',
      note: 'Instagram: animestarofficial, Telegram: animestarofficial, Facebook: animestarofficial',
      links: allLinks,
      instructions: 'Now refresh your website and test the social media icons. They will now open correct AnimeStar profiles.'
    });
    
  } catch (error) {
    console.error('❌ Emergency social media fix error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// ROOT ROUTE - SEO OPTIMIZED VERSION FOR ANIMESTAR
// ============================================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AnimeStar - Watch Anime Online in Hindi & English | Free Anime Streaming</title>
      <meta name="description" content="Watch anime online for free in Hindi Dub, Hindi Sub, and English Sub. HD quality streaming and downloads. Latest anime episodes and movies on AnimeStar.">
      <meta name="keywords" content="watch anime online, hindi anime, english anime, anime in hindi, anime in english, free anime streaming, anime download, AnimeStar, animestar.in">
      <meta name="robots" content="index, follow">
      <link rel="canonical" href="https://animestar.in">
      
      <!-- Open Graph -->
      <meta property="og:title" content="AnimeStar - Watch Anime Online in Hindi & English">
      <meta property="og:description" content="Watch anime online for free in Hindi and English. HD quality streaming and downloads on AnimeStar.">
      <meta property="og:image" content="/AnimeStarlogo.jpg">
      <meta property="og:url" content="https://animestar.in">
      <meta property="og:type" content="website">
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="AnimeStar - Watch Anime Online in Hindi & English">
      <meta name="twitter:description" content="Watch anime online for free in Hindi and English. HD quality streaming and downloads on AnimeStar.">
      <meta name="twitter:image" content="/AnimeStarlogo.jpg">
      
      <style>
        body {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 2rem;
          max-width: 800px;
          background: rgba(30, 41, 59, 0.8);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        h1 {
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 1rem;
          font-size: 2.5rem;
        }
        a {
          color: #60a5fa;
          text-decoration: none;
          font-weight: bold;
          margin: 0 10px;
          transition: color 0.3s;
        }
        a:hover {
          color: #38bdf8;
          text-decoration: underline;
        }
        .seo-badge {
          background: linear-gradient(90deg, #10b981, #059669);
          color: white;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: bold;
          margin-left: 10px;
        }
        .section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(15, 23, 42, 0.6);
          border-radius: 12px;
          text-align: left;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 1.5rem;
        }
        .btn {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          text-decoration: none;
          display: inline-block;
          font-weight: 500;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          cursor: pointer;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
          color: white;
          text-decoration: none;
        }
        .status {
          color: #10b981;
          font-weight: bold;
          font-size: 1.1rem;
        }
        .seo-info {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 1.5rem;
          border-radius: 12px;
          margin: 1.5rem 0;
          border-left: 4px solid #3b82f6;
        }
        .seo-checklist {
          list-style: none;
          padding: 0;
        }
        .seo-checklist li {
          margin: 10px 0;
          padding-left: 28px;
          position: relative;
        }
        .seo-checklist li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
          font-size: 1.2rem;
        }
        code {
          background: rgba(0, 0, 0, 0.3);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #fbbf24;
        }
        .logo {
          font-size: 3rem;
          margin-bottom: 1rem;
          background: linear-gradient(90deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .brand {
          color: #60a5fa;
          font-weight: bold;
        }
        .footer {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #94a3b8;
          font-size: 0.9rem;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">⭐</div>
        <h1>AnimeStar Server <span class="seo-badge">SEO OPTIMIZED</span></h1>
        <p class="status">✅ Backend API is running correctly - SEO Ready for Google</p>
        <p>📺 Frontend: <a href="https://animestar.in" target="_blank"><span class="brand">AnimeStar.in</span></a></p>
        <p>⚙️ Admin Access: Press Ctrl+Shift+Alt on the frontend</p>
        
        <div class="seo-info">
          <h3>🔍 SEO Features Enabled:</h3>
          <ul class="seo-checklist">
            <li>Dynamic Sitemap: <a href="/sitemap.xml" target="_blank">/sitemap.xml</a></li>
            <li>Robots.txt: <a href="/robots.txt" target="_blank">/robots.txt</a></li>
            <li>RSS Feed: <a href="/rss.xml" target="_blank">/rss.xml</a></li>
            <li>Dynamic URLs with slugs</li>
            <li>Structured Data (JSON-LD)</li>
            <li>Meta Tags on all pages</li>
            <li>Open Graph & Twitter Cards</li>
            <li>Admin SEO Control Panel</li>
          </ul>
          <p style="color: #10b981; margin-top: 10px; font-weight: bold;">
            ✅ SEO FIX APPLIED: Search query URLs removed from sitemap to avoid Google penalties
          </p>
        </div>
        
        <div class="section">
          <h3>🚀 Ready for Google Search Console:</h3>
          <p><strong>Steps to submit to Google:</strong></p>
          <ol>
            <li>Go to <a href="https://search.google.com/search-console" target="_blank">Google Search Console</a></li>
            <li>Add property: <code>https://animestar.in</code></li>
            <li>Verify ownership (HTML tag method recommended)</li>
            <li>Submit sitemap: <code>https://animestar.in/sitemap.xml</code></li>
            <li>Wait 24-48 hours for indexing</li>
          </ol>
        </div>
        
        <div class="links">
          <a href="/api/health" class="btn">Health Check</a>
          <a href="/sitemap.xml" class="btn" target="_blank">View Sitemap</a>
          <a href="/robots.txt" class="btn" target="_blank">View Robots.txt</a>
          <a href="/api/anime/featured" class="btn">Check Featured Anime</a>
          <a href="/api/debug/animes" class="btn">Debug Anime</a>
        </div>
        
        <div class="footer">
          Server Time: ${new Date().toLocaleString()}<br>
          SEO Status: Complete - Ready for Google Indexing<br>
          Sitemap Status: ✅ SEO Safe (No search query URLs)<br>
          Domain: <span class="brand">animestar.in</span><br>
          Next Step: Submit to Google Search Console
        </div>
      </div>
      
      <!-- JSON-LD Structured Data -->
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "AnimeStar",
        "url": "https://animestar.in",
        "description": "Watch anime online for free in Hindi and English. HD quality streaming and downloads on AnimeStar.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://animestar.in/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
      </script>
    </body>
    </html>
  `);
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AnimeStar Server running on port ${PORT} - SEO OPTIMIZED`);
  console.log(`🔧 Admin: admin / Anime2121818144`);   
  console.log(`🌐 Frontend: https://animestar.in`);
  console.log(`🗺️ Sitemap: https://animestar.in/sitemap.xml`);
  console.log(`🤖 Robots: https://animestar.in/robots.txt`);
  console.log(`📰 RSS Feed: https://animestar.in/rss.xml`);
  console.log(`✅ SEO Features:`);
  console.log(`   - ✅ Dynamic sitemap with anime pages`);
  console.log(`   - ✅ Robots.txt for search engines`);
  console.log(`   - ✅ RSS feed for updates`);
  console.log(`   - ✅ Structured data for Google`);
  console.log(`   - ✅ ID + Slug support for URLs`);
  console.log(`🚨 SEO IMPORTANT FIX:`);
  console.log(`   - ❌ Search query URLs REMOVED from sitemap`);
  console.log(`   - ✅ Now safe from Google duplicate content penalty`);
  console.log(`📈 Next Step: Submit sitemap to Google Search Console`);
});