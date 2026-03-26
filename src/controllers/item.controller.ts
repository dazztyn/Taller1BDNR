import { Request, Response } from 'express';
import { Etcd3 } from 'etcd3';

const client = new Etcd3({ hosts: 'etcd-db:2379' });

export const guardarPersonaje = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.id;

        const respuestaAPI = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        const dataPersonaje = await respuestaAPI.json();

        const clave = `personaje:${id}`;

        const valor = JSON.stringify(dataPersonaje); 

        await client.put(clave).value(valor);
        
        res.json({ mensaje: `¡El personaje ${dataPersonaje.name} fue guardado en Etcd con éxito!` });
    } catch (error) {
        res.status(500).json({ error: "Error al guardar el personaje" });
    }
};

export const leerPersonaje = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const clave = `personaje:${id}`;
        
        const valorEnTexto = await client.get(clave).string();
        
        if (!valorEnTexto) {
            res.status(404).json({ error: "Ese personaje no está en nuestra base de datos Etcd" });
            return;
        }
        
        const dataJSON = JSON.parse(valorEnTexto);
        res.json({ fuente: "Desde Etcd", datos: dataJSON });
    } catch (error) {
        res.status(500).json({ error: "Error al leer el dato" });
    }
};

export const actualizarPersonaje = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const clave = `personaje:${id}`;

        const valorActualTexto = await client.get(clave).string();
        
        if (!valorActualTexto) {
            res.status(404).json({ error: "El personaje no existe, no se puede actualizar" });
            return;
        }

        const datosActuales = JSON.parse(valorActualTexto);
       
        const datosNuevos = req.body; 
        
        const datosCombinados = { ...datosActuales, ...datosNuevos };

        const nuevoValorEnTexto = JSON.stringify(datosCombinados);
        await client.put(clave).value(nuevoValorEnTexto);
        
        res.json({ 
            mensaje: `¡El personaje ${id} fue actualizado con éxito!`, 
            datos: datosCombinados 
        });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el dato en Etcd" });
    }
};

export const borrarPersonaje = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id;
        const clave = `personaje:${id}`;
        
        const valorEnTexto = await client.get(clave).string();
        
        if (!valorEnTexto) {
            res.status(404).json({ error: "Ese personaje no está en nuestra base de datos Etcd" });
            return;
        }

        await client.delete().key(clave);
        res.json({ mensaje: `Se borró la clave '${clave}' de Etcd con éxito.` });
    } catch (error) {
        res.status(500).json({ error: "Error al borrar el dato" });
    }
};