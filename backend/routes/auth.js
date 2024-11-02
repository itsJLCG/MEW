const express = require("express");
const router = express.Router();

const { Register, 
     Login, 
    //  getUserProfile, 
    //  updateProfile, 
     verifyEmail } = require('../controllers/auth');
// const { isAuthenticatedUser} = require('../middlewares/auth');
const upload = require("../utils/multer");


//Login and Register routes
router.post('/login', Login);
router.post("/signup", upload.single('profileImage'), Register);

// Email verification route
router.get('/verify-email/:token', verifyEmail);

//Profile w/ Middleware Routes
// router.get('/profile', isAuthenticatedUser, getUserProfile);
// router.put('/profile/update', isAuthenticatedUser,  upload.single("profileImage"), updateProfile)



module.exports = router;




