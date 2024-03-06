const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret,
});

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const { originalname, buffer } = file;

    // Upload stream to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'FrAngelEvents', public_id: originalname },
      (error, result) => {
        if (error) {
          console.error('Error uploading image to Cloudinary:', error);
          reject('Internal Server Error');
        } else {
          resolve(result.secure_url);
        }
      }
    );

    // Pipe the file buffer to the upload stream
    uploadStream.end(buffer);
  });
};

module.exports = {
  uploadImageToCloudinary,
};