import express, { Request, Response } from 'express';
import { Etcd3 } from 'etcd3';

// Inicializamos la aplicación Express
const app = express();
app.use(express.json()); 

// Nos conectamos a la base de datos Etcd
const client = new Etcd3({ hosts: 'etcd-db:2379' });

// 1. CREATE / UPDATE (Crear o Actualizar)
app.post('/items', async (req: Request, res: Response) => {
    try {
        const { clave, valor } = req.body;
        await client.put(clave).value(valor);
        res.json({ mensaje: `Se guardó la clave '${clave}' con éxito.` });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el dato" });
    }
});

// 2. READ (Leer)
app.get('/items/:clave', async (req: Request, res: Response) => {
    try {
        const clave = req.params.clave;
        const valor = await client.get(clave).string();
        
        if (!valor) {
            res.status(404).json({ error: "Clave no encontrada" });
            return;
        }
        res.json({ clave, valor });
    } catch (error) {
        res.status(500).json({ error: "Error al leer el dato" });
    }
});

// 3. DELETE (Borrar)
app.delete('/items/:clave', async (req: Request, res: Response) => {
    try {
        const clave = req.params.clave;
        await client.delete().key(clave);
        res.json({ mensaje: `Se borró la clave '${clave}' con éxito.` });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar el dato" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API con TypeScript corriendo en http://localhost:${PORT}`);
});