const express = require("express");
const router = express.Router();

const { Register, 
     Login, 
     getUserProfile, 
     updateProfile, 
     verifyEmail,
     storeFcmToken,
     logout,
     googleLogin,
fetchCustomerDetails} = require('../controllers/auth');
const { isAuthenticatedUser} = require('../middlewares/auth');
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

// Google Login
router.post('/google-login', googleLogin);

//Profile w/ Middleware Routes
router.get('/profile', isAuthenticatedUser, getUserProfile);
router.put('/profile/update', isAuthenticatedUser,  upload.single("profileImage"), updateProfile)

//fetch customer details
router.get('/customer-details', isAuthenticatedUser, fetchCustomerDetails)



module.exports = router;




