const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// App
const app = express();

const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const brandRoutes = require('./routes/brands');
const categoryRoutes = require('./routes/categories');
const promoRoutes = require('./routes/promos');

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

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', promoRoutes);


