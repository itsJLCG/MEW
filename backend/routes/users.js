const express = require('express');
const router = express.Router();
//image
const multer = require('multer');


//image
const upload = multer({ dest: 'uploads/' });
const { create, getAllUsers, getUserBySlug, update, remove} = require('../controllers/UserController');

// Route to handle user creation and image upload
router.post('/users', upload.array('image', 5), create);
router.put('/users/:slug', upload.array('image', 5), update);

// router.post('/users', create);
router.get('/users/all', getAllUsers);
router.get('/users/:slug', getUserBySlug);
router.delete('/users/:slug', remove);
// router.put('/users/:slug', update);
module.exports = router;