import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

/**
 * Generando usuarios mock
 * @param {number} count 
 * @returns {Array} 
 */

export const generateMockUsers = async (count) => {
  const users = [];
  const roles = ['user', 'admin', 'premium'];
  
  for (let i = 0; i < count; i++) {
    const user = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      age: faker.number.int({ min: 18, max: 80 }),
      password: "defaultPassword123",
      role: roles[Math.floor(Math.random() * roles.length)]
    };
    
    users.push(user);
  }
  
  return users;
};