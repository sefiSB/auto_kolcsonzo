<script setup>
import { ref, onMounted } from "vue";


const currentTo = localStorage.getItem("toDate");
const currentFrom = localStorage.getItem("fromDate");

const cf = ref(currentFrom);
const ct = ref(currentTo);

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

function buttonClicked() {
  localStorage.setItem("fromDate", currentFrom);
  localStorage.setItem("toDate", currentTo);
  filteredCarData.value = cars.value.filter((car) => {
    const from = Date.parse(cf.value);
    const to = Date.parse(ct.value);
    console.log(from, to);
    return car.to >= from && car.from <= to;
  });
  console.log(filteredCarData.value);
}

const activeIdx = ref(0);
const user = ref({
  name: "",
  email: "",
  address: "",
  phone: "",
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

  console.log(
    "Renting car id:",
    cars.value.find((car) => car.id === activeIdx.value)
  );
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
      from: rentedCar.from,
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

  filteredCarData.value = filteredCarData.value.filter(
    (car) => car.id !== rentedCar.id
  );
  activeIdx.value = 0;
  user.value = {
    name: "",
    email: "",
    address: "",
    phone: "",
  };
}



</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-info-subtle px-5 fixed-top"
  >
    <router-link to="/"><img  class="img-small mx-5" src="../assets/car.png" alt=""></router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
        
      </ul>
      <form class="d-flex ms-auto">
        <label for="fromdate" class=""> Start date</label>
        <input
          id="fromdate"
          v-model="cf"
          class="form-control mr-sm-2 mx-3"
          type="date"
          placeholder="Kezdő dátum"
        />

        <label for="todate" class="">End date</label>
        <input
          id="todate"
          v-model="ct"
          class="form-control mr-sm-2 mx-3"
          type="date"
          placeholder="Záró dátum"
        />
        <button
          @click.prevent="buttonClicked"
          v-bind:class="
            cf && ct && cf < ct ? '' : 'disabled'
          "
          class="btn btn-secondary my-2 my-sm-0 mx-3"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  </nav>

  <div v-for="car in filteredCarData" :key="car.id" class="container mt-5">
    <div class="row align-items-center mb-2 border p-3 bg-light rounded shadow-sm">
      <div class="col-sm">
        <span class="fw-bold">{{ car.brand }}</span>
        <span class="ms-2">{{ car.model }}</span>
      </div>
      <div class="col-sm"><img class="w-50" :src="car.image" alt="" /></div>
      <div class="col-sm">{{ car.pricePerDay }}$ / day</div>
      <div class="col-sm">
        <button @click="rentClicked(car.id)" class="btn btn-dark">
          ↓
        </button>
      </div>
    </div>
    <div
      :class="[
        'row justify-content-center',
        { 'd-none': activeIdx !== car.id },
      ]"
    >
      <div class="col-auto p-4 border bg-light rounded shadow-sm">
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

        <button @click="submitRent()" type="button" class="btn btn-secondary" :class="user.name && user.email && user.address && user.phone ? '' : 'disabled'">
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

<style>
.read-the-docs {
  color: #888;
}

.img-small {
  width: 100px;
  height: auto;
}
</style>
