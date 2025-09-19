const sequelize = require('./db');
const Customer = require('./models/customer')(sequelize);
const Product = require('./models/product')(sequelize);
const Order = require('./models/order')(sequelize);

// Define table associations
Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });

Product.hasMany(Order, { foreignKey: 'product_id' });
Order.belongsTo(Product, { foreignKey: 'product_id' });

const seedDatabase = async () => {
  try {
    const { faker } = await import('@faker-js/faker');
    await sequelize.sync({ force: true });
    console.log('Database synced. Tables dropped and recreated.');

    const customers = [];
    const regions = ['North', 'South', 'East', 'West'];
    const types = ['Individual', 'Business'];
    for (let i = 0; i < 50; i++) {
      customers.push({
        name: faker.person.fullName(),
        region: faker.helpers.arrayElement(regions),
        type: faker.helpers.arrayElement(types),
      });
    }
    await Customer.bulkCreate(customers);
    console.log('Customers seeded successfully.');

    const products = [];
    const categories = ['Electronics', 'Books', 'Home Goods', 'Apparel'];
    for (let i = 0; i < 100; i++) {
      products.push({
        name: faker.commerce.productName(),
        category: faker.helpers.arrayElement(categories),
        price: faker.commerce.price({ min: 10, max: 1000 }),
      });
    }
    await Product.bulkCreate(products);
    console.log('Products seeded successfully.');

    const orders = [];
    const customerIds = Array.from({ length: 50 }, (_, i) => i + 1);
    const productIds = Array.from({ length: 100 }, (_, i) => i + 1);

    for (let i = 0; i < 2000; i++) {
      orders.push({
        order_date: faker.date.between({ from: '2023-01-01', to: '2025-09-18' }),
        quantity: faker.number.int({ min: 1, max: 10 }),
        customer_id: faker.helpers.arrayElement(customerIds),
        product_id: faker.helpers.arrayElement(productIds),
      });
    }
    await Order.bulkCreate(orders);
    console.log('Orders seeded successfully.');

    console.log('Seeding process completed!');
  } catch (error) {
    console.error('Failed to seed database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();