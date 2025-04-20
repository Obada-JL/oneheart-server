// Apply multer upload to handle file uploads
router.post(
  "/",
  (req, res, next) => {
    console.log("POST Programs Request headers:", req.headers);
    
    // Use any() instead of fields() to accept any field
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Multer error in POST:", err);
        return res.status(400).json({ 
          message: 'File upload error',
          error: err.message
        });
      }
      next();
    });
  },
  addProgram
);

router.put(
  "/:id",
  (req, res, next) => {
    console.log("PUT Programs Request headers:", req.headers);
    
    // Use any() instead of fields() to accept any field
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("Multer error in PUT:", err);
        return res.status(400).json({ 
          message: 'File upload error',
          error: err.message
        });
      }
      next();
    });
  },
  updateProgram
); 