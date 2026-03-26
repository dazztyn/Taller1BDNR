import { Router } from 'express';
import { guardarPersonaje, leerPersonaje, actualizarPersonaje, borrarPersonaje } from '../controllers/item.controller';

const router = Router();

router.post('/personajes', guardarPersonaje);
router.get('/personajes/:id', leerPersonaje);
router.put('/personajes/:id', actualizarPersonaje);
router.delete('/personajes/:id', borrarPersonaje);


export default router;