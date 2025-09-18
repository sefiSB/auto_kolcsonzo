<script setup>
import { ref, onMounted } from "vue";
/* import { useCarStore } from "../stores/carStore"; */
//const carStore = useCarStore();

const currentTo = localStorage.getItem("toDate");
const currentFrom = localStorage.getItem("fromDate");
const filteredCarData = ref([]);
const cars = ref([]);
onMounted(async () => {
  const response = await fetch("http://localhost:3000/cars");
  cars.value = await response.json();
  console.log(cars);

  filteredCarData.value = cars.value.filter((car) => {
    const from = Date.parse(currentFrom);
    const to = Date.parse(currentTo);
    return car.to >= from && car.from <= to;
  });
  console.log(filteredCarData.value);

});

const activeIdx = ref(0);
const user = ref({
  name: "",
  email: "",
  address: "",
  phone: "",
  duration: 0,
});

function rentClicked(id) {
  if (activeIdx.value === id) {
    activeIdx.value = 0;
    return;
  }
  console.log(`Rent clicked for car id: ${id}`);
  activeIdx.value = id;
}

function submitRent() {
  console.log("Submit rent clicked");

  console.log("Renting car id:", cars.value.find((car) => car.id === activeIdx.value));
  const rentedCar = cars.value.find((car) => car.id === activeIdx.value);

  fetch("http://localhost:3000/rentals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: activeIdx.value,
      brand: rentedCar.brand,
      model: rentedCar.model,
      pricePerDay: rentedCar.pricePerDay,
      image: rentedCar.image,
      rentFrom: Date.parse(currentFrom),
      rentTo: Date.parse(currentTo),
      totalPrice:
        ((Date.parse(currentTo) - Date.parse(currentFrom)) /
          (1000 * 60 * 60 * 24)) *
        rentedCar.pricePerDay,
      user: user.value,
      from:rentedCar.from,
      to: rentedCar.to,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log("Új autó hozzáadva:", data));

  //Delete from cars
  fetch(`http://localhost:3000/cars/${rentedCar.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => console.log("Autó törölve:", data));

    filteredCarData.value = filteredCarData.value.filter(car => car.id !== rentedCar.id);
  activeIdx.value = 0;
  user.value = {
    name: "",
    email: "",
    address: "",
    phone: "",
    duration: 0,
  };
}
</script>

<template>
  <h1>Car List Component</h1>
  <div v-for="car in filteredCarData" :key="car.id" class="container">
    <div class="row align-items-center mb-2">
      <div class="col-sm">
        <span class="fw-bold">{{ car.brand }}</span>
        <span class="ms-2">{{ car.model }}</span>
      </div>
      <div class="col-sm"><img :src="car.image" alt="" /></div>
      <div class="col-sm">{{ car.pricePerDay }}$ / day</div>
      <div class="col-sm">
        <button @click="rentClicked(car.id)" class="btn btn-primary">
          Rent
        </button>
      </div>
    </div>
    <div
      :class="[
        'row justify-content-center',
        { 'd-none': activeIdx !== car.id },
      ]"
    >
      <div class="col-auto">
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text">Name</span>
          <input
            v-model="user.name"
            type="text"
            class="form-control w-50 text-center"
          />
        </div>
        <div class="input-group input-group-sm mb-2">
          <span class="input-group-text">Email</span>
          <input
            v-model="user.email"
            type="text"
            class="form-control w-50 text-center"
          />
        </div>

        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm"
              >Address</span
            >
          </div>
          <input
            v-model="user.address"
            type="text"
            class="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>

        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="inputGroup-sizing-sm"
              >Phone</span
            >
          </div>
          <input
            v-model="user.phone"
            type="text"
            class="form-control"
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
          />
        </div>

        <button @click="submitRent()" type="button" class="btn btn-secondary">
          Rent car for
          {{
            ((Date.parse(currentTo) - Date.parse(currentFrom)) /
              (1000 * 60 * 60 * 24)) *
            car.pricePerDay
          }}
          $
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
