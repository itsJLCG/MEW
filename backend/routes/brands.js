const express = require('express');
const router = express.Router();

const multer = require('multer');


const upload = multer({ dest: 'uploads/' });
const { create, getAllBrands, getBrandBySlug, getBrandById, update, remove} = require('../controllers/BrandController');


router.post('/brands', upload.array('image', 5), create);
router.put('/brands/:slug', upload.array('image', 5), update);

router.get('/brands/all', getAllBrands);
router.get('/brands/:slug', getBrandBySlug);
router.get('/brands/:id', getBrandById);
router.delete('/brands/:slug', remove);
module.exports = router;