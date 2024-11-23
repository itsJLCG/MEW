const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
const { create, getAllUsers, getUserById, update, remove, updateUserRole } = require('../controllers/UserController');

router.post('/users', upload.array('image', 5), create);
router.put('/users/:id', upload.array('image', 5), update);
router.put('/users/role/:id', updateUserRole); // Add this line

router.get('/users/all', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', remove);

module.exports = router;