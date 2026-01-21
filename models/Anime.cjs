 // models/Anime.cjs - UPDATED WITH SEO FIELDS + CLEAN SLUGS (NO RANDOM STRINGS)
const mongoose = require('mongoose');
const slugify = require('slugify'); // ✅ ADD THIS AT TOP

const animeSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Title is required'],
    trim: true,
    unique: true 
  },
  description: String,
  genreList: [String],
  releaseYear: Number,
  thumbnail: String,
  bannerImage: String, // ✅ ADDED: For featured/carousel display
  contentType: {
    type: String,
    enum: ['Anime', 'Movie', 'Manga'],
    default: 'Anime'
  },
  // ✅ UPDATED: Added 'English Sub' to enum
  subDubStatus: {
    type: String,
    enum: ['Hindi Dub', 'Hindi Sub', 'English Sub', 'Both', 'Subbed', 'Dubbed', 'Sub & Dub', 'Dual Audio'],
    default: 'Hindi Sub'
  },
  status: {
    type: String,
    enum: ['Ongoing', 'Complete'],
    default: 'Ongoing'
  },
  reportCount: { type: Number, default: 0 },
  lastReported: Date,
  
  // ✅ YEH NAYA FIELD ADD KARO: Last episode/chapter added timestamp
  lastContentAdded: { 
    type: Date, 
    default: Date.now 
  },

  // ✅ CORRECTED: USE 'featured' INSTEAD OF 'isFeatured' FOR CONSISTENCY
  featured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },
  
  // ✅ ADDITIONAL FIELDS FOR BETTER FUNCTIONALITY
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  totalEpisodes: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  
  // ✅ SEO FIELDS ADDED HERE
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  seoKeywords: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    required: [true, 'Slug is required'],
    trim: true,
    lowercase: true
  }
}, { 
  timestamps: true, // ✅ Yeh automatically createdAt and updatedAt fields add karega
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ✅ YEH VIRTUAL FIELDS ADD KARO
animeSchema.virtual('episodes', {
  ref: 'Episode',
  localField: '_id',
  foreignField: 'animeId'
});

animeSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'mangaId'
});

// ✅ YEH MIDDLEWARE ADD KARO: Jab bhi anime save ho to CLEAN slug auto-generate ho (NO RANDOM STRINGS)
animeSchema.pre('save', async function(next) {
  try {
    // ✅ ONLY generate slug if it's a new document or title is modified
    if (this.isNew || this.isModified('title')) {
      // ✅ If slug is already provided (from admin), use it as is (but clean it)
      if (this.slug && this.slug.trim() !== '') {
        // Clean the provided slug
        this.slug = slugify(this.slug, {
          lower: true,
          strict: true, // Remove special characters
          trim: true
        });
      } else {
        // ✅ Generate clean slug from title (NO RANDOM STRINGS)
        this.slug = slugify(this.title, {
          lower: true,
          strict: true,
          trim: true
        });
      }
      
      // ✅ Check if slug already exists (excluding current document)
      const existingAnime = await this.constructor.findOne({ 
        slug: this.slug,
        _id: { $ne: this._id }
      });
      
      // ✅ If slug exists for another document, append numbers (1, 2, 3...) NOT random strings
      if (existingAnime) {
        let counter = 2;
        let newSlug = this.slug;
        
        // Keep trying until we find a unique slug
        while (await this.constructor.findOne({ 
          slug: newSlug,
          _id: { $ne: this._id }
        })) {
          newSlug = `${this.slug}-${counter}`;
          counter++;
        }
        
        this.slug = newSlug;
      }
    }
    
    // ✅ Agar episodes array modify hui hai to lastContentAdded update karo
    if (this.isModified('episodes') && this.episodes && this.episodes.length > 0) {
      this.lastContentAdded = new Date();
    }
    
    // ✅ Agar SEO fields empty hain to default values set karo
    if (!this.seoTitle || this.seoTitle.trim() === '') {
      this.seoTitle = `Watch ${this.title} Online in ${this.subDubStatus} | AnimeStar`;
    }
    
    if (!this.seoDescription || this.seoDescription.trim() === '') {
      this.seoDescription = `Watch ${this.title} online in ${this.subDubStatus}. HD quality streaming and downloads.`;
    }
    
    if (!this.seoKeywords || this.seoKeywords.trim() === '') {
      // Auto-generate keywords based on title, genre, and subDubStatus
      const keywords = [];
      
      // Title-based keywords
      keywords.push(`${this.title} anime`, `watch ${this.title} online`, `${this.title} ${this.subDubStatus.toLowerCase()}`);
      
      // Genre-based keywords
      if (this.genreList && this.genreList.length > 0) {
        this.genreList.forEach(genre => {
          keywords.push(`${genre.toLowerCase()} anime`, `${this.title} ${genre.toLowerCase()}`);
        });
      }
      
      // Language/Type based keywords
      if (this.subDubStatus.includes('Hindi Dub')) {
        keywords.push('hindi dubbed anime', 'anime in hindi', 'hindi dub');
      }
      if (this.subDubStatus.includes('Hindi Sub')) {
        keywords.push('hindi subbed anime', 'anime with hindi subtitles', 'hindi sub');
      }
      if (this.subDubStatus.includes('English Sub')) {
        keywords.push('english subbed anime', 'anime in english', 'english sub');
      }
      
      // Content type keywords
      if (this.contentType === 'Movie') {
        keywords.push(`${this.title} movie`, 'anime movies', 'full anime movie');
      }
      
      // Remove duplicates and join
      const uniqueKeywords = [...new Set(keywords)];
      this.seoKeywords = uniqueKeywords.join(', ');
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ YEH STATIC METHOD ADD KARO: Anime update karo jab episode add ho
animeSchema.statics.updateLastContent = async function(animeId) {
  await this.findByIdAndUpdate(animeId, {
    lastContentAdded: new Date(),
    updatedAt: new Date()
  });
};

// ✅ YEH STATIC METHOD ADD KARO: Clean slug generate karo (NO RANDOM STRINGS)
animeSchema.statics.generateCleanSlug = async function(title, excludeId = null) {
  // Generate base slug from title
  let baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });
  
  let slug = baseSlug;
  let counter = 1;
  
  // Build query to check for existing slugs
  let query = { slug };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }
  
  let existing = await this.findOne(query);
  
  // If slug exists, add numbers (1, 2, 3...)
  while (existing) {
    slug = `${baseSlug}-${counter}`;
    counter++;
    query.slug = slug;
    existing = await this.findOne(query);
  }
  
  return slug;
};

// ✅ YEH INDEXES ADD KARO FOR FASTER QUERIES
animeSchema.index({ featured: 1, featuredOrder: -1 }); // For featured anime queries
animeSchema.index({ title: 'text' }); // For text search
animeSchema.index({ lastContentAdded: -1 }); // For recent updates
animeSchema.index({ createdAt: -1 }); // For new arrivals
animeSchema.index({ slug: 1 }, { unique: true }); // ✅ SEO: For slug-based URL queries (UNIQUE)
animeSchema.index({ seoTitle: 'text', seoDescription: 'text', seoKeywords: 'text' }); // ✅ SEO: For SEO content search

module.exports = mongoose.models.Anime || mongoose.model('Anime', animeSchema);