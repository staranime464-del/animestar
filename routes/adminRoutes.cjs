 // routes/adminRoutes.cjs 
const express = require('express');
const router = express.Router();
const Anime = require('../models/Anime.cjs');
const Episode = require('../models/Episode.cjs');
const Chapter = require('../models/Chapter.cjs');
const Report = require('../models/Report.cjs');
const SocialMedia = require('../models/SocialMedia.cjs');
const slugify = require('slugify');  

// filtered anime list with content type
router.get('/anime-list', async (req, res) => {
  try {
    const { status, contentType } = req.query;
    let query = {};
    if (status && status !== 'All') query.status = status;
    if (contentType && contentType !== 'All') query.contentType = contentType;
    
    const animes = await Anime.find(query).populate('episodes').sort({ createdAt: -1 });
    res.json(animes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// anime/movie WITH CLEAN SLUG GENERATION
router.post('/add-anime', async (req, res) => {
  try {
    const { title, description, thumbnail, status, subDubStatus, genreList, releaseYear, contentType } = req.body;
    
    // Input validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const existing = await Anime.findOne({ 
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') } 
    });
    
    if (existing) {
      return res.status(400).json({ 
        error: 'Anime/Movie already exists',
        existingAnime: {
          title: existing.title,
          slug: existing.slug,
          url: `/detail/${existing.slug}`
        }
      });
    }

    // Generate clean base slug from title
    let baseSlug = slugify(title, {
      lower: true,
      strict: true, // Remove special characters
      trim: true
    });

    // Check if slug already exists
    let slug = baseSlug;
    let counter = 1;

    while (await Anime.findOne({ slug })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    console.log('🔗 Generated clean slug:', slug);

    // Create new anime with auto-generated clean slug
    const anime = new Anime({ 
      title: title.trim(),
      description: description || '', 
      thumbnail: thumbnail || '', 
      status: status || 'Ongoing',
      subDubStatus: subDubStatus || 'Hindi Sub', 
      genreList: genreList || [], 
      releaseYear: releaseYear || new Date().getFullYear(),
      contentType: contentType || 'Anime',
      slug: slug, // CLEAN SLUG 
      seoTitle: `Watch ${title.trim()} Online in ${subDubStatus || 'Hindi Sub'} | AnimeStar`,
      seoDescription: `Watch ${title.trim()} online in ${subDubStatus || 'Hindi Sub'}. HD quality streaming and downloads on AnimeStar.`
    });
    
    await anime.save();
    
    res.json({ 
      success: true, 
      message: `${contentType || 'Anime'} added successfully with clean SEO-friendly slug!`, 
      anime,
      seoUrl: `/detail/${slug}`
    });
    
  } catch (err) {
    console.error('Add anime error:', err);
    
    // Handle duplicate slug error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.slug) {
      return res.status(400).json({
        success: false,
        error: 'Generated slug already exists. Please try again with a different title.'
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// EDIT anime/movie WITH SLUG 
router.put('/edit-anime/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find existing anime
    const existingAnime = await Anime.findById(id);
    if (!existingAnime) {
      return res.status(404).json({ error: 'Anime/Movie not found' });
    }

    // If title is being updated, update slug too
    if (updateData.title && updateData.title !== existingAnime.title) {
      // Generate clean base slug from new title
      let baseSlug = slugify(updateData.title, {
        lower: true,
        strict: true,
        trim: true
      });

      // Check if new slug already exists for other anime
      let newSlug = baseSlug;
      let counter = 1;

      while (await Anime.findOne({ 
        slug: newSlug,
        _id: { $ne: id } // Exclude current anime
      })) {
        newSlug = `${baseSlug}-${counter}`;
        counter++;
      }

      updateData.slug = newSlug;
      console.log('🔄 Updated slug:', newSlug);
      
      // SEO fields if title changed
      if (!updateData.seoTitle || updateData.seoTitle.trim() === '') {
        updateData.seoTitle = `Watch ${updateData.title} Online in ${updateData.subDubStatus || existingAnime.subDubStatus} | AnimeStar`;
      }
      
      if (!updateData.seoDescription || updateData.seoDescription.trim() === '') {
        updateData.seoDescription = `Watch ${updateData.title} online in ${updateData.subDubStatus || existingAnime.subDubStatus}. HD quality streaming and downloads on AnimeStar.`;
      }
    }
    
    const anime = await Anime.findByIdAndUpdate(
      id, 
      { 
        ...updateData,
        updatedAt: new Date()
      }, 
      { new: true, runValidators: true }
    );
    
    if (!anime) return res.status(404).json({ error: 'Anime/Movie not found' });
    
    res.json({ 
      success: true, 
      message: 'Updated successfully with SEO-friendly slug!', 
      anime,
      newSlug: anime.slug
    });
    
  } catch (err) {
    console.error('Edit anime error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE anime/movie
router.delete('/delete-anime', async (req, res) => {
  try {
    const { id } = req.body;
    await Anime.findByIdAndDelete(id);
    // Also delete associated episodes and reports
    await Episode.deleteMany({ animeId: id });
    await Report.deleteMany({ animeId: id });
    res.json({ success: true, message: 'Deleted successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// BULK UPDATE SLUGS FOR EXISTING ANIME
router.post('/bulk-update-slugs', async (req, res) => {
  try {
    console.log('🔄 Starting bulk slug update for existing anime...');
    
    // Get all anime
    const allAnime = await Anime.find({}).select('title slug _id');
    
    let updatedCount = 0;
    let skippedCount = 0;
    let errors = [];
    
    for (let anime of allAnime) {
      try {
        // Generate clean slug from title
        let baseSlug = slugify(anime.title, {
          lower: true,
          strict: true,
          trim: true
        });
        
        let newSlug = baseSlug;
        let counter = 1;
        
        // Check if slug exists for other anime
        while (await Anime.findOne({ 
          slug: newSlug,
          _id: { $ne: anime._id }
        })) {
          newSlug = `${baseSlug}-${counter}`;
          counter++;
        }
        
        // Only update if slug is different
        if (newSlug !== anime.slug) {
          await Anime.findByIdAndUpdate(anime._id, { 
            slug: newSlug,
            updatedAt: new Date()
          });
          
          updatedCount++;
          console.log(`✅ Updated: "${anime.title}" -> "${newSlug}"`);
        } else {
          skippedCount++;
        }
      } catch (error) {
        errors.push({ title: anime.title, error: error.message });
        console.error(`❌ Error updating "${anime.title}":`, error.message);
      }
    }
    
    res.json({
      success: true,
      message: `Updated ${updatedCount} anime slugs, skipped ${skippedCount}`,
      updated: updatedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : 'No errors'
    });
    
  } catch (err) {
    console.error('❌ Bulk slug update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// EPISODE MANAGEMENT ROUTES  

// Edit episode  
router.put('/edit-episode/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, downloadLinks, secureFileReference, session } = req.body;

    console.log('📝 Edit episode request:', {
      id,
      hasDownloadLinks: !!downloadLinks,
      downloadLinksCount: downloadLinks ? downloadLinks.length : 0
    });

    // Validate downloadLinks if provided
    if (downloadLinks !== undefined) {
      if (!Array.isArray(downloadLinks) || downloadLinks.length === 0) {
        return res.status(400).json({ error: 'At least one download link is required' });
      }

      if (downloadLinks.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 download links allowed' });
      }

      // Validate each download link
      for (let i = 0; i < downloadLinks.length; i++) {
        const link = downloadLinks[i];
        if (!link.name || !link.url) {
          return res.status(400).json({ 
            error: `Download link ${i + 1} must have both name and url` 
          });
        }
      }
    }

    const updateData = {};
    if (typeof title !== 'undefined') updateData.title = title;
    if (typeof secureFileReference !== 'undefined') updateData.secureFileReference = secureFileReference;
    if (typeof session !== 'undefined') updateData.session = session;
    
    // Handle downloadLinks update
    if (downloadLinks !== undefined) {
      updateData.downloadLinks = downloadLinks.map((link, index) => ({
        name: link.name || `Download Link ${index + 1}`,
        url: link.url,
        quality: link.quality || '',
        type: link.type || 'direct'
      }));
    }

    const episode = await Episode.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!episode) return res.status(404).json({ error: 'Episode not found' });

    // anime's lastContentAdded for homepage priority
    await Anime.updateLastContent(episode.animeId);

    res.json({ 
      success: true, 
      message: 'Episode updated successfully!', 
      episode 
    });
  } catch (err) {
    console.error('Edit episode error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// Edit chapter  
router.put('/edit-chapter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, downloadLinks, secureFileReference, session } = req.body;

    console.log('📝 Edit chapter request:', {
      id,
      hasDownloadLinks: !!downloadLinks,
      downloadLinksCount: downloadLinks ? downloadLinks.length : 0
    });

    // Validate downloadLinks if provided
    if (downloadLinks !== undefined) {
      if (!Array.isArray(downloadLinks) || downloadLinks.length === 0) {
        return res.status(400).json({ error: 'At least one download link is required' });
      }

      if (downloadLinks.length > 5) {
        return res.status(400).json({ error: 'Maximum 5 download links allowed' });
      }

      // Validate each download link
      for (let i = 0; i < downloadLinks.length; i++) {
        const link = downloadLinks[i];
        if (!link.name || !link.url) {
          return res.status(400).json({ 
            error: `Download link ${i + 1} must have both name and url` 
          });
        }
      }
    }

    const updateData = {};
    if (typeof title !== 'undefined') updateData.title = title;
    if (typeof secureFileReference !== 'undefined') updateData.secureFileReference = secureFileReference;
    if (typeof session !== 'undefined') updateData.session = session;
    
    // Handle downloadLinks  
    if (downloadLinks !== undefined) {
      updateData.downloadLinks = downloadLinks.map((link, index) => ({
        name: link.name || `Download Link ${index + 1}`,
        url: link.url,
        quality: link.quality || '',
        type: link.type || 'direct'
      }));
    }

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // manga's lastContentAdded for homepage priority
    await Anime.updateLastContent(chapter.mangaId);

    res.json({ 
      success: true, 
      message: 'Chapter updated successfully!', 
      chapter 
    });
  } catch (err) {
    console.error('Edit chapter error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
});

// REPORT MANAGEMENT ROUTES

// Get all reports
router.get('/reports', async (req, res) => {
  try {
    console.log('📋 Admin fetching reports...');
    
    const reports = await Report.find()
      .populate('animeId', 'title thumbnail')
      .populate('resolvedBy', 'username')
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${reports.length} reports for admin`);
    
    res.json(reports);
  } catch (err) {
    console.error('❌ Admin reports error:', err);
    res.status(500).json({ error: err.message });
  }
});

// report status with response  
router.put('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const updateData = {
      status,
      ...(adminResponse && {
        adminResponse,
        responseDate: new Date()
      })
    };

    // Server automatically sets resolvedBy from admin token
    if (status === 'Fixed') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.admin.id;
    }

    const report = await Report.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('resolvedBy', 'username');

    res.json({ 
      success: true, 
      message: 'Report updated successfully!', 
      report 
    });
  } catch (err) {
    console.error('Report update error:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE single report
router.delete('/reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Deleting report with ID:', id);

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    await Report.findByIdAndDelete(id);
    
    console.log('✅ Report deleted successfully');
    res.json({ 
      success: true, 
      message: 'Report deleted successfully!' 
    });
  } catch (err) {
    console.error('❌ Delete report error:', err);
    res.status(500).json({ error: err.message });
  }
});

// BULK DELETE reports
router.post('/reports/bulk-delete', async (req, res) => {
  try {
    const { reportIds } = req.body;
    await Report.deleteMany({ _id: { $in: reportIds } });
    res.json({ 
      success: true, 
      message: `${reportIds.length} reports deleted successfully!` 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SOCIAL MEDIA MANAGEMENT ROUTES

// Get social media links
router.get('/social-media', async (req, res) => {
  try {
    const socialLinks = await SocialMedia.find();
    res.json(socialLinks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update social media link
router.put('/social-media/:platform', async (req, res) => {
  try {
    const { platform } = req.params;
    const { url, isActive } = req.body;
    
    const socialLink = await SocialMedia.findOneAndUpdate(
      { platform },
      { url, isActive },
      { new: true, upsert: true }
    );
    
    res.json(socialLink);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ANALYTICS ROUTE  
router.get('/analytics', async (req, res) => {
  try {
    const totalAnimes = await Anime.countDocuments({ contentType: 'Anime' });
    const totalMovies = await Anime.countDocuments({ contentType: 'Movie' });
    const totalManga = await Anime.countDocuments({ contentType: 'Manga' });
    const totalEpisodes = await Episode.countDocuments();
    const totalChapters = await Chapter.countDocuments();
    const totalReports = await Report.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'Pending' });

    res.json({
      totalAnimes,
      totalMovies,
      totalManga,
      totalEpisodes,
      totalChapters,
      totalReports,
      pendingReports,
      // Basic stats 
      todayUsers: 0,
      totalUsers: 0,
      todayEarnings: 0,
      totalEarnings: 0,
      todayPageViews: 0,
      totalPageViews: 0
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  }
});

// GET user info
router.get('/user-info', async (req, res) => {
  try {
    const Admin = require('../models/Admin.cjs');
    const admin = await Admin.findById(req.admin.id);
    res.json({
      username: admin.username,
      email: admin.email
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get episode details for editing  
router.get('/episode/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const episode = await Episode.findById(id);
    
    if (!episode) {
      return res.status(404).json({ error: 'Episode not found' });
    }
    
    res.json({
      success: true,
      episode: {
        _id: episode._id,
        animeId: episode.animeId,
        title: episode.title,
        episodeNumber: episode.episodeNumber,
        session: episode.session,
        secureFileReference: episode.secureFileReference,
        downloadLinks: episode.downloadLinks || []
      }
    });
  } catch (err) {
    console.error('Get episode error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get chapter details for editing  
router.get('/chapter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const chapter = await Chapter.findById(id);
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json({
      success: true,
      chapter: {
        _id: chapter._id,
        mangaId: chapter.mangaId,
        title: chapter.title,
        chapterNumber: chapter.chapterNumber,
        session: chapter.session,
        secureFileReference: chapter.secureFileReference,
        downloadLinks: chapter.downloadLinks || []
      }
    });
  } catch (err) {
    console.error('Get chapter error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;