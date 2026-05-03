const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for resumes
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ethiojobfinder/resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'raw',
    public_id: (req, file) => `resume_${req.user.id}_${Date.now()}`
  }
});

// Configure storage for profile pictures
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ethiojobfinder/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 400, height: 400, crop: 'fill' }]
  }
});

// Configure storage for company logos
const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ethiojobfinder/logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }]
  }
});

// File filter for resumes
const resumeFileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed for resumes'), false);
  }
};

// File filter for images
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG images are allowed'), false);
  }
};

// Upload middleware for resumes
const uploadResume = multer({
  storage: storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload middleware for profile pictures
const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Upload middleware for company logos
const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Delete file from Cloudinary
const deleteFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
    return true;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    return false;
  }
};

// Get file URL
const getFileUrl = (publicId) => {
  return cloudinary.url(publicId, { resource_type: 'raw' });
};

module.exports = {
  cloudinary,
  uploadResume,
  uploadProfile,
  uploadLogo,
  deleteFile,
  getFileUrl
};
