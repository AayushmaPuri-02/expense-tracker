const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'expense-tracker_DEV',
      allowedFormats: ["png","jpg", "jpeg","pdf", "doc", "docx"],
    },
  });

  // For loan documents (PDFs, etc.)
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'loan-documents',
    allowedFormats: ["pdf"],
    resource_type: "raw",// allow any file type (images, pdfs, docs)
  },
});

  module.exports={
    cloudinary,
    storage, 
    documentStorage
  }