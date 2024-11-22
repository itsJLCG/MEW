const express = require("express");
const router = express.Router();

const { Register, 
     Login, 
    //  getUserProfile, 
    //  updateProfile, 
     verifyEmail,
     storeFcmToken,
     logout } = require('../controllers/auth');
// const { isAuthenticatedUser} = require('../middlewares/auth');
const upload = require("../utils/multer");


//Login and Register routes
router.post('/login', Login);
router.post("/signup", upload.single('profileImage'), Register);

// Email verification route
router.get('/verify-email/:token', verifyEmail);

// Route to store FCM token
router.post('/store-fcm-token', storeFcmToken);

// Route to clear FCM token on logout
router.post('/logout', logout);

//Profile w/ Middleware Routes
// router.get('/profile', isAuthenticatedUser, getUserProfile);
// router.put('/profile/update', isAuthenticatedUser,  upload.single("profileImage"), updateProfile)



module.exports = router;




