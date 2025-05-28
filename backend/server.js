import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import Product from './models/product.model.js'
import mongoose from 'mongoose'

dotenv.config()

const app = express()
app.use(express.json()) // to parse JSON data from the request body

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        return res.status(200).json({success: true, data: products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({success: false, message: 'Server error' });
    }
})

app.post('/api/products', async (req, res) => {
    const product = req.body; // data from the user in his body

    if (!product.name || !product.price) {
        return res.status(400).json({success: false, message: 'Please, all the fields are required' });
    }

    const newProduct = new Product(product);

    try {
        await newProduct.save();
        return res.status(201).json({success: true, data: newProduct });
    } catch (error) {
        console.error('Error saving product:', error);
        return res.status(500).json({success: false, message: 'Server error' });
    
    }
})

app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const productData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({success: false, message: 'Invalid product ID' });
    }

    if (!productData.name || !productData.price) {
        return res.status(400).json({success: false, message: 'Please, all the fields are required' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({success: false, message: 'Product not found' });
        }
        return res.status(200).json({success: true, data: updatedProduct });
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({success: false, message: 'Server error' });
    }
})

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    console.log('id:', id);

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({success: false, message: 'Product not found' });
        }
        return res.status(200).json({success: true, message: 'Product deleted successfully' });
    } catch (error) {   
        console.error('Error deleting product:', error);
        return res.status(500).json({success: false, message: 'Server error' });
    }
});

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB()
    console.log(`Server is running on http://localhost:5000`);
})

