 // models/Anime.cjs  
const mongoose = require('mongoose');
const slugify = require('slugify');  

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
  bannerImage: String, // featured/carousel display
  contentType: {
    type: String,
    enum: ['Anime', 'Movie', 'Manga'],
    default: 'Anime'
  },
  // 'English Sub' to enum
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
  
  // Last episode/chapter added timestamp
  lastContentAdded: { 
    type: Date, 
    default: Date.now 
  },

  // 'featured' INSTEAD OF 'isFeatured' FOR CONSISTENCY
  featured: {
    type: Boolean,
    default: false
  },
  featuredOrder: {
    type: Number,
    default: 0
  },
  
  // ADDITIONAL FIELDS FOR BETTER FUNCTIONALITY
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
  
  // SEO FIELDS 
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
  timestamps: true,  
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// VIRTUAL FIELDS 
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

// CLEAN slug auto-generate ho 
animeSchema.pre('save', async function(next) {
  try {
    // ONLY generate slug if it's a new document or title is modified
    if (this.isNew || this.isModified('title')) {
      // If slug is already provided (from admin), use it as is  
      if (this.slug && this.slug.trim() !== '') {
        // Clean the provided slug
        this.slug = slugify(this.slug, {
          lower: true,
          strict: true, // Remove special characters
          trim: true
        });
      } else {
        // Generate clean slug from title  
        this.slug = slugify(this.title, {
          lower: true,
          strict: true,
          trim: true
        });
      }
      
      // Check if slug already exists (excluding current document)
      const existingAnime = await this.constructor.findOne({ 
        slug: this.slug,
        _id: { $ne: this._id }
      });
      
      // If slug exists for another document, append numbers (1, 2, 3...) NOT random strings
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
    
    // lastContentAdded   
    if (this.isModified('episodes') && this.episodes && this.episodes.length > 0) {
      this.lastContentAdded = new Date();
    }
    
    // empty default values 
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

animeSchema.statics.updateLastContent = async function(animeId) {
  await this.findByIdAndUpdate(animeId, {
    lastContentAdded: new Date(),
    updatedAt: new Date()
  });
};

// Clean slug generate karo  
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

// FASTER QUERIES
animeSchema.index({ featured: 1, featuredOrder: -1 });  
animeSchema.index({ title: 'text' }); // For text search
animeSchema.index({ lastContentAdded: -1 }); // For recent updates
animeSchema.index({ createdAt: -1 }); // For new arrivals
animeSchema.index({ slug: 1 }, { unique: true }); // For slug-based URL queries (UNIQUE)
animeSchema.index({ seoTitle: 'text', seoDescription: 'text', seoKeywords: 'text' }); // For SEO content search

module.exports = mongoose.models.Anime || mongoose.model('Anime', animeSchema);