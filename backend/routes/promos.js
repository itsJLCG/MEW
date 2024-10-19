const express = require('express');
const router = express.Router();

const multer = require('multer');


const upload = multer({ dest: 'uploads/' });
const { create, getAllPromos, getPromoBySlug, getPromoById, update, remove} = require('../controllers/PromoController');


router.post('/promos', upload.array('image', 5), create);
router.put('/promos/:slug', upload.array('image', 5), update);

router.get('/promos/all', getAllPromos);
router.get('/promos/:slug', getPromoBySlug);
router.get('/promos/:id', getPromoById);
router.delete('/promos/:slug', remove);
module.exports = router;