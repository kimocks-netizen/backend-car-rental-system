const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('SUPABASE_URL:', !!process.env.SUPABASE_URL);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  console.error('SUPABASE_KEY:', !!process.env.SUPABASE_KEY);
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Storage helper functions
const uploadCarImage = async (fileBuffer, fileName, bucket = 'car-images') => {
  try {
    // Check if bucket exists, create if it doesn't
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        allowedMimeTypes: ['image/*'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) {
        console.warn('Bucket creation failed, but continuing:', createError.message);
      }
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: 'image/*',
        upsert: false
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

const getPublicUrl = (fileName, bucket = 'car-images') => {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);
  return publicUrl;
};

module.exports = {
  supabase,
  uploadCarImage,
  getPublicUrl
};