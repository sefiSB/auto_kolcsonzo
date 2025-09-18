import { faker } from "@faker-js/faker";
import fs from "fs";

export function generateCars(num) {
  const cars = []; // <-- minden hívásnál új tömb
  for (let i = 0; i < num; i++) {
    let fromDate = faker.date.future({ years: 0.2 });
    let toDate = faker.date.future({ years: 0.2 });
    if (toDate < fromDate) {
      const temp = fromDate;
      fromDate = toDate;
      toDate = temp;
    }
    cars.push({
      id: faker.string.uuid(),
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      cmprfrom: fromDate,
      cmprto: toDate,
      from: Date.parse(fromDate),
      to: Date.parse(toDate),
      pricePerDay: faker.number.int({ min: 20, max: 200 }),
      image: faker.image.urlPicsumPhotos({ width: 200, height: 120 }),
      user: null
    });
  }
  const rentals = [];
  return cars;

}
