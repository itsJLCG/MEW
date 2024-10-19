const express = require('express');
const router = express.Router();

const multer = require('multer');


const upload = multer({ dest: 'uploads/' });
const { create, getAllCategories, getCategoryBySlug, getCategoryById, update, remove} = require('../controllers/CategoryController');


router.post('/categories', upload.array('image', 5), create);
router.put('/categories/:slug', upload.array('image', 5), update);

router.get('/categories/all', getAllCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/categories/:id', getCategoryById);
router.delete('/categories/:slug', remove);
module.exports = router;