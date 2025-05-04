import { faker } from '@faker-js/faker';

/**
 * Genera productos mock
 * @param {number} count Número de productos a generar
 * @returns {Array} Array de productos mock
 */
export const generateMockProducts = (count) => {
    const products = [];
    
    const categories = ['smartphones', 'laptops', 'tablets', 'headphones', 'smartwatches', 'cameras', 'gaming'];
    const brands = ['Samsung', 'Apple', 'Lenovo', 'HP', 'Sony', 'Microsoft', 'Google', 'Dell', 'ASUS', 'Acer'];
    
    const generateProductName = (category, brand) => {
      const models = {
        smartphones: ['Pro', 'Ultra', 'Plus', 'Max', 'Edge', 'Studio'],
        laptops: ['XPS', 'ThinkPad', 'Pavilion', 'Envy', 'MacBook', 'Surface', 'Legion'],
        tablets: ['iPad', 'Galaxy Tab', 'Surface Pro', 'MatePad', 'Xiaomi Pad'],
        headphones: ['AirPods', 'WH-1000X', 'Momentum', 'QuietComfort', 'FreeBuds', 'Elite'],
        smartwatches: ['Watch', 'Galaxy Watch', 'Apple Watch', 'Fitbit', 'Mi Watch'],
        cameras: ['Alpha', 'EOS', 'Cyber-shot', 'Lumix', 'X Series', 'Z Series'],
        gaming: ['PlayStation', 'Xbox', 'Switch', 'Steam Deck', 'ROG', 'Legion']
      };
      
      const categoryModels = models[category] || ['Series'];
      const model = categoryModels[Math.floor(Math.random() * categoryModels.length)];
      const number = Math.floor(Math.random() * 50) + 1;
      
      return `${brand} ${model} ${number}`;
    };
    
    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      
      const product = {
        title: generateProductName(category, brand),
        description: faker.commerce.productDescription(),
        price: Number((faker.number.float({ min: 100, max: 3000, precision: 0.01 })).toFixed(2)),
        thumbnail: faker.image.urlLoremFlickr({ category: 'technology' }),
        code: faker.string.alphanumeric(10).toUpperCase(),
        stock: faker.number.int({ min: 0, max: 100 }),
        status: true,
        category: category
      };
      
      products.push(product);
    }
    
    return products;
  };