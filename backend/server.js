const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

//Cloudinary
const cloudinary = require('cloudinary').v2;

// App
const app = express();

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const promoRoutes = require('./routes/promos');
const authRoutes = require("./routes/auth");
const cartRoutes = require('./routes/carts');    
// const customerRoutes = require('./routes/customers');   

// Mongoose
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));


// Port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));


// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', promoRoutes);

// Use the user routes
app.use("/api/auth", authRoutes);

//Cart routes
app.use("/api", cartRoutes);

// //customer fetch
// app.use("/api", customerRoutes)


