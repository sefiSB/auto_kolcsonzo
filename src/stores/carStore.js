import { defineStore } from 'pinia'
import { generateCars } from '../cars'

export const useCarStore = defineStore('car', {
  state: () => ({
    carData: generateCars(1000),
    filteredCarData: [],
    rentedCars: [],
    currentFrom: null,
    currentTo: null
  }),
  actions: {
    filterCars(from, to) {
      this.filteredCarData = this.carData.filter((car) => {
        console.log(`Car from: ${car.from}, to: ${car.to}, filter from: ${Date.parse(from)}, to: ${Date.parse(to)}`);
        return car.from >= Date.parse(from) && car.to <= Date.parse(to);
      });
    },
    rentCar(carId, userName) {
        const car = this.carData.find(c => c.id === carId);
        car.user=userName;
        this.rentedCars.push(car);
        this.carData = this.carData.filter(c => c.id !== carId);
        this.filteredCarData = this.filteredCarData.filter(c => c.id !== carId);
        console.log(`Car with id ${carId} rented by ${userName}`);
    }
  }
})