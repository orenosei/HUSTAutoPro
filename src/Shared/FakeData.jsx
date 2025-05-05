import { faker } from '@faker-js/faker';

function createRandomCarList() {
  return {
    name: faker.vehicle.vehicle(),
    fuelType: faker.vehicle.fuel(), // Sửa: fuelType viết đúng định dạng camelCase
    model: faker.vehicle.model(),
    type: faker.vehicle.type(),
    image: 'https://th.bing.com/th/id/OIP.prmvbP6O7Sa5S6m_iLy2uQHaEK?rs=1&pid=ImgDetMain', // Sửa: bỏ dấu nháy đơn dư
    miles: 1000,
    gearType: 'Automatic',
    price: faker.finance.amount({ min: 4000, max: 20000 })
  };
}

const carList = faker.helpers.multiple(createRandomCarList, {
  count: 7
});

export default {
  carList
};
