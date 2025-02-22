import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { adoptionsService, petsService, usersService } from '../src/services/index.js';

describe('Pruebas del Router de Adopciones', () => {
    let testUser;
    let testPet;
    let testAdoption;

    // Conectar a la base de datos de prueba antes de todas las pruebas
    beforeAll(async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL || 'mongodb+srv://franespindola71:Negra2510.@decay.k2orc.mongodb.net/test?retryWrites=true&w=majority&appName=Decay');
        } catch (error) {
            console.error('Error al conectar a la base de datos de prueba:', error);
        }
    });

    // Configurar datos de prueba antes de cada test
    beforeEach(async () => {
        console.log('\n🔧 Preparando datos de prueba...');
        
        // Crear un usuario de prueba
        testUser = await usersService.create({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@test.com',
            password: 'testpass123'
        });
        console.log('✓ Usuario de prueba creado');

        // Crear una mascota de prueba
        testPet = await petsService.create({
            name: 'TestPet',
            specie: 'Dog',
            adopted: false
        });
        console.log('✓ Mascota de prueba creada');

        // Crear una adopción de prueba
        testAdoption = await adoptionsService.create({
            owner: testUser._id,
            pet: testPet._id
        });
        console.log('✓ Adopción de prueba creada');
    });

    // Limpiar después de cada prueba
    afterEach(async () => {
        console.log('\n🧹 Limpiando base de datos de prueba...');
        await mongoose.connection.dropDatabase();
        console.log('✓ Base de datos limpiada');
    });

    // Desconectar después de todas las pruebas
    afterAll(async () => {
        console.log('\n👋 Cerrando conexión con la base de datos...');
        await mongoose.connection.close();
        console.log('✓ Conexión cerrada');
    });

    describe('GET /api/adoptions', () => {
        it('debería retornar todas las adopciones', async () => {
            console.log('\n🔍 Probando obtención de todas las adopciones...');
            const response = await request(app).get('/api/adoptions');
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(Array.isArray(response.body.payload)).toBe(true);
            expect(response.body.payload.length).toBeGreaterThan(0);
            console.log('✓ Prueba completada: Obtención de adopciones exitosa');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('debería retornar una adopción específica cuando se proporciona un ID válido', async () => {
            console.log('\n🔍 Probando obtención de adopción específica...');
            const response = await request(app).get(`/api/adoptions/${testAdoption._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.payload._id.toString()).toBe(testAdoption._id.toString());
            console.log('✓ Prueba completada: Obtención de adopción específica exitosa');
        });

        it('debería retornar 404 cuando se proporciona un ID de adopción inválido', async () => {
            console.log('\n🔍 Probando obtención con ID inválido...');
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/adoptions/${invalidId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe('error');
            expect(response.body.error).toBe('Adoption not found');
            console.log('✓ Prueba completada: Error 404 recibido correctamente');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('debería crear una nueva adopción cuando se proporcionan IDs válidos de usuario y mascota', async () => {
            console.log('\n🔍 Probando creación de nueva adopción...');
            const newUser = await usersService.create({
                first_name: 'New',
                last_name: 'User',
                email: 'new@test.com',
                password: 'newpass123',
                pets: []
            });
            console.log('✓ Nuevo usuario creado para la prueba');

            const newPet = await petsService.create({
                name: 'NewPet',
                specie: 'Cat',
                adopted: false
            });
            console.log('✓ Nueva mascota creada para la prueba');

            const response = await request(app)
                .post(`/api/adoptions/${newUser._id}/${newPet._id}`);
            
            expect(response.status).toBe(200);
            expect(response.body.status).toBe('success');
            expect(response.body.message).toBe('Pet adopted');

            // Verificar que la mascota está marcada como adoptada
            const updatedPet = await petsService.getBy({ _id: newPet._id });
            expect(updatedPet.adopted).toBe(true);
            console.log('✓ Estado de adopción de mascota verificado');

            // Verificar que el usuario tiene la mascota en su lista
            const updatedUser = await usersService.getUserById(newUser._id);
            expect(updatedUser.pets.some(pet => pet._id.toString() === newPet._id.toString())).toBe(true);
            console.log('✓ Lista de mascotas del usuario verificada');
        });

        it('debería retornar 404 cuando se proporciona un ID de usuario inválido', async () => {
            console.log('\n🔍 Probando adopción con ID de usuario inválido...');
            const invalidUserId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/adoptions/${invalidUserId}/${testPet._id}`);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe('error');
            expect(response.body.error).toBe('user Not found');
            console.log('✓ Prueba completada: Error 404 recibido correctamente');
        });

        it('debería retornar 404 cuando se proporciona un ID de mascota inválido', async () => {
            console.log('\n🔍 Probando adopción con ID de mascota inválido...');
            const invalidPetId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${invalidPetId}`);
            
            expect(response.status).toBe(404);
            expect(response.body.status).toBe('error');
            expect(response.body.error).toBe('Pet not found');
            console.log('✓ Prueba completada: Error 404 recibido correctamente');
        });

        it('debería retornar 400 cuando la mascota ya está adoptada', async () => {
            console.log('\n🔍 Probando adopción de mascota ya adoptada...');
            // Primero, marcar la mascota como adoptada
            await petsService.update(testPet._id, { adopted: true });
            console.log('✓ Mascota marcada como adoptada para la prueba');

            const response = await request(app)
                .post(`/api/adoptions/${testUser._id}/${testPet._id}`);
            
            expect(response.status).toBe(400);
            expect(response.body.status).toBe('error');
            expect(response.body.error).toBe('Pet is already adopted');
            console.log('✓ Prueba completada: Error 400 recibido correctamente');
        });
    });
});