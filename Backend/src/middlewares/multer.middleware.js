import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/temp");
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    callback(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, callback) => {
  const allowedTypes = /jpg|jpeg|png|mp4|mkv/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    callback(null, true);
  } else {
    callback(new Error("Unsupported file type"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,  
  },
});

export { upload };