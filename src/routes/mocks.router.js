import express from 'express';
import { generateMockUsers, generateMockPets, generateMockData } from '../utils/mocking.js';
import { usersService, petsService } from '../services/index.js';

const router = express.Router();

// Endpoint para mockingpets

router.get('/mockingpets', (req, res) => {
    const pets = generateMockPets(100);
    res.json(pets);
});

// Endpoint para mockingusers

router.get('/mockingusers', (req, res) => {
    const users = generateMockUsers(50);
    res.json(users);
});

// Endpoint para generateData

router.post('/generateData', async (req, res) => {
    try {
        const { users = 0, pets = 0 } = req.body;
        
        // Validar que los numeros sean validos
        if (!Number.isInteger(users) || !Number.isInteger(pets) || users < 0 || pets < 0) {
            return res.status(400).send('Los parametros users y pets deben ser numeros enteros positivos');
        }

        // Generar y guardar los datos
        const generatedUsers = generateMockUsers(users);
        const generatedPets = generateMockPets(pets);

        // Usar los servicios para insertar los datos (bugsito)
        if (users > 0) await usersService.create(generatedUsers);
        if (pets > 0) await petsService.create(generatedPets);

        res.status(201).json({
            status: 'success',
            message: 'Data generada e insertada con exito',
            summary: {
                usersGenerated: users,
                petsGenerated: pets
            }
        });
    } catch (error) {
        console.error('Error en generateData:', error);
        res.status(500).send('Error generando e insertando la data: ' + error.message);
    }
});

export default router;