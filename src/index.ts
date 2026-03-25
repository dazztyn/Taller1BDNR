import express from 'express';
import itemRoutes from './routes/item.routes.js';

const app = express();
app.use(express.json()); 

app.use('/api', itemRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API estructurada corriendo en http://localhost:${PORT}`);
});