import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db.js'
import ProductRoutes from './routes/product.route.js'

dotenv.config()

const app = express()
app.use(express.json()) // to parse JSON data from the request body

app.use('/api/products', ProductRoutes);

console.log(process.env.MONGO_URI);

app.listen(5000, () => {
    connectDB()
    console.log(`Server is running on http://localhost:5000`);
})

