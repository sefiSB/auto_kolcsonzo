<script setup>
import { onMounted, ReactiveEffect, ref } from "vue";
import { faker } from "@faker-js/faker";
import { useRouter } from "vue-router";

const router= useRouter();

const username = ref("");
const password = ref("");
const isAdmin = ref(false);
const activeTab = ref("notrented");

const newCar = ref({
  id: faker.string.uuid(),
  brand: "",
  model: "",
  pricePerDay: 0,
  image: "",
  from: 0,
  to: 0,
  user: null,
});

function modifyClicked(id) {
  console.log("Modify clicked for car id:", id);
  localStorage.setItem("modifyCarId", id);
  router.push({ path: "/modifycar" });
}
function deleteClicked(id) {
  console.log("Delete clicked for car id:", id);
  fetch(`http://localhost:3000/cars/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      carData.value = carData.value.filter((car) => car.id !== id);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function addCarButton() {
  console.log("Add car button clicked");
  console.log(newCar.value);

  fetch("http://localhost:3000/cars", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: newCar.value.id,
      brand: newCar.value.brand,
      model: newCar.value.model,
      pricePerDay: newCar.value.pricePerDay,
      image: newCar.value.image,
      from: newCar.value.from,
      to: newCar.value.to,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      newCar.value.brand = "";
      newCar.value.model = "";
      newCar.value.pricePerDay = 0;
      newCar.value.image = "";
      newCar.value.from = 0;
      newCar.value.to = 0;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const carData = ref([]);
const rentedCarData = ref([]);

onMounted(async () => {
  const response = await fetch("http://localhost:3000/cars");
  carData.value = await response.json();

  const r = await fetch("http://localhost:3000/rentals");
  rentedCarData.value = await r.json();

  console.log(carData.value);
  console.log(rentedCarData.value);
});

function login() {
  // Simple hardcoded check for demonstration purposes
  if (username.value === "admin" && password.value === "admin") {
    isAdmin.value = true;
  }
}
</script>

<template>
  <h1>Admin component</h1>
  <div v-if="!isAdmin">
    <h2>You need to log in as admin to access this</h2>

    <div class="input-group input-group-sm mb-2">
      <span class="input-group-text">Username</span>
      <input
        v-model="username"
        type="text"
        class="form-control w-50 text-center"
      />
    </div>
    <div class="input-group input-group-sm mb-2">
      <span class="input-group-text">Password</span>
      <input
        v-model="password"
        type="password"
        class="form-control w-50 text-center"
      />
    </div>
    <button @click="login" type="button" class="btn btn-secondary">
      Log in
    </button>
  </div>

  <div v-if="isAdmin">
    <div class="w-80 h-80 bg-dark"></div>
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab == 'notrented' }]"
          aria-current="page"
          href="#"
          @click.prevent="activeTab = 'notrented'"
          >Not rented</a
        >
      </li>
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab == 'rented' }]"
          href="#"
          @click.prevent="activeTab = 'rented'"
          >Rented</a
        >
      </li>
      <li class="nav-item">
        <a
          :class="['nav-link', { active: activeTab == 'addcar' }]"
          href="#"
          @click.prevent="activeTab = 'addcar'"
          >Add car</a
        >
      </li>
    </ul>

    <div v-if="activeTab == 'notrented'">
      <!-- <div v-for="car in carData" :key="car.id" class="container">
        <div class="row">
          <div class="col">
            {{ car.brand }}
          </div>
          <div class="col">
            {{ car.model }}
          </div>
          <div class="col">
            {{ car.pricePerDay }}
          </div>
        </div>
      </div> -->

      <div v-for="car in carData" :key="car.id" class="container">
        <div class="row align-items-center mb-2">
          <div class="col-sm">
            <span class="fw-bold">{{ car.brand }}</span>
            <span class="ms-2">{{ car.model }}</span>
          </div>
          <div class="col-sm"><img class="w-50" :src="car.image" alt="" /></div>
          <div class="col-sm">{{ car.pricePerDay }}$ / day</div>
          <div class="col-sm">
            <button @click="modifyClicked(car.id)" class="btn btn-primary">
              Modify
            </button>
            <button @click="deleteClicked(car.id)" class="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab == 'rented'">
      <div v-for="car in rentedCarData" :key="car.id" class="container">
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
      </div>
    </div>
    <div v-if="activeTab == 'addcar'">
      <h2>Add car</h2>
      <form>
        <div class="mb-3">
          <label for="brand" class="form-label">Brand</label>
          <input
            v-model="newCar.brand"
            type="text"
            class="form-control"
            id="brand"
          />
        </div>
        <div class="mb-3">
          <label for="model" class="form-label">Model</label>
          <input
            v-model="newCar.model"
            type="text"
            class="form-control"
            id="model"
          />
        </div>
        <div class="mb-3">
          <label for="pricePerDay" class="form-label">Price per day</label>
          <input
            v-model="newCar.pricePerDay"
            type="number"
            class="form-control"
            id="pricePerDay"
          />
        </div>
        <div class="mb-3">
          <label for="image" class="form-label">Image URL</label>
          <input
            v-model="newCar.image"
            type="text"
            class="form-control"
            id="image"
          />
        </div>
        <div class="mb-3">
          <label for="from" class="form-label">From</label>
          <input
            v-model="newCar.from"
            type="date"
            class="form-control"
            id="from"
          />
        </div>
        <div class="mb-3">
          <label for="to" class="form-label">To</label>
          <input v-model="newCar.to" type="date" class="form-control" id="to" />
        </div>

        <button
          @click.prevent="addCarButton"
          type="submit"
          class="btn btn-primary"
        >
          Add Car
        </button>
      </form>
    </div>
  </div>
</template>

<style body>
.align-top {
  align-self: flex-start;
  width: 100%;
}
</style>
