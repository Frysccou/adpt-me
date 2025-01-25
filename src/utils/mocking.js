import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import faker from "faker";
import userModel from "../dao/models/User.js";
import petModel from "../dao/models/Pet.js";

export const generateMockUsers = (num) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        const user = {
            first_name: faker.name.firstName(),
            last_name: faker.name.lastName(),
            email: faker.internet.email(),
            password: bcrypt.hashSync("coder123", 10),
            role: faker.random.arrayElement(['user','admin']),
            pets: []
        };
        users.push(user);
    }
    return users;
};

export const generateMockPets = (num) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        const pet = {
            name: faker.name.firstName(),
            specie: faker.random.arrayElement(['dog','cat','bird']),
            birthDate: faker.date.past(),
            adopted: false,
            owner: null
        };
        pets.push(pet);
    }
    return pets;
};

export const generateMockData = async (numUsers, numPets) => {
    return {
        users: generateMockUsers(numUsers),
        pets: generateMockPets(numPets)
    };
};