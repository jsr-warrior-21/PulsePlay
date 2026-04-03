import multer from 'multer';

// 1. diskStorage defines storage rules
const storage = multer.diskStorage({
    // 2. destination: ALWAYS saves to ./public/temp folder
    destination: function(req, file, callback) {
        callback(null, "./public/temp");  // null=success, path=where to save
    },
    // 3. filename: Keeps ORIGINAL filename (e.g. "photo.jpg" stays "photo.jpg")
    filename: function(req, file, callback) {
        callback(null, file.originalname); 
    }
});

// 4. upload middleware bundles the storage config
const upload = multer({ storage: storage });

export { upload }; 