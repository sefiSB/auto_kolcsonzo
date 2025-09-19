<script setup>
import { onMounted, ReactiveEffect, ref } from "vue";
import { faker } from "@faker-js/faker";
import { useRouter } from "vue-router";

const router = useRouter();

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

const filteredCarData = ref([]);
const filteredRentedCarData = ref([]);
const cf = ref(null);
const ct = ref(null);
const filtered = ref(false);

onMounted(async () => {
  const response = await fetch("http://localhost:3000/cars");
  carData.value = await response.json();

  const r = await fetch("http://localhost:3000/rentals");
  rentedCarData.value = await r.json();

  console.log(carData.value);
  console.log(rentedCarData.value);
});

function buttonClicked() {
  filtered.value = true;
  filteredCarData.value = carData.value.filter((car) => {
    const from = Date.parse(cf.value);
    const to = Date.parse(ct.value);
    return car.to >= from && car.from <= to;
  });
  filteredRentedCarData.value = rentedCarData.value.filter((car) => {
    const from = Date.parse(cf.value);
    const to = Date.parse(ct.value);
    return car.to >= from && car.from <= to;
  });
  console.log(filteredCarData.value);
  console.log(filteredRentedCarData.value);
}

function login() {
  // Simple hardcoded check for demonstration purposes
  if (username.value === "admin" && password.value === "admin") {
    isAdmin.value = true;
  }
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-info-subtle px-5 fixed-top"
  >
    <router-link to="/"
      ><img class="img-small mx-5" src="../assets/car.png" alt=""
    /></router-link>
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
          v-bind:class="cf && ct && cf < ct ? '' : 'disabled'"
          class="btn btn-secondary my-2 my-sm-0 mx-3"
          type="submit"
        >
          Search
        </button>
        <button
          @click.prevent="
            filtered = false;
            cf = null;
            ct = null;
          "
          v-bind:class="cf && ct && cf < ct ? '' : 'disabled'"
          class="btn btn-outline-success my-2 my-sm-0 mx-3"
          type="submit"
        >
          Clear
        </button>
      </form>
    </div>
  </nav>

  <div v-if="!isAdmin" class="">
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

  <div v-if="isAdmin" class="mt-5 pt-5">
    <ul
      class="nav nav-tabs bg-white shadow-sm align-items-center justify-content-center"
      style="
        position: fixed;
        top: 4rem; 
        left: 0; 
        right: 0; 
      "
    >
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
      <div
        v-if="!filtered"
        v-for="car in carData"
        :key="car.id"
        class="container"
      >
        <div class="row align-items-center mb-2 border p-3 bg-light rounded shadow-sm">
          <div class="col-sm">
            <span class="fw-bold">{{ car.brand }}</span>
            <span class="ms-2">{{ car.model }}</span>
          </div>
          <div class="col-sm">
            <img class="w-50" :src="car.image" alt="" />
          </div>
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

      <div
        v-if="filtered"
        v-for="car in filteredCarData"
        :key="car.id"
        class="container"
      >
        <div class="row align-items-center mb-2">
          <div class="col-sm">
            <span class="fw-bold">{{ car.brand }}</span>
            <span class="ms-2">{{ car.model }}</span>
          </div>
          <div class="col-sm">
            <img class="w-50" :src="car.image" alt="" />
          </div>
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
      <div
        v-if="!filtered"
        v-for="car in rentedCarData"
        :key="car.id"
        class="container"
      >
        <div class="row align-items-center mb-2 border p-3 bg-light rounded shadow-sm">
          <div class="col-sm">
            <span class="fw-bold">{{ car.brand }}</span>
            <span class="ms-2">{{ car.model }}</span>
          </div>
          <div class="col-sm"><img :src="car.image" alt="" class="img-small" /></div>
          <div class="col-sm">{{ car.pricePerDay }}$ / day</div>
          <div class="col-sm border-start ps-3">
            <div class="row">{{ car.user.name }}</div>
            <div class="row">{{ car.user.phone }}</div>
            <div class="row">{{ car.user.email }}</div>
            <div class="row">{{ car.user.address }}</div>
          </div>
        </div>
      </div>

      <div
        v-if="filtered"
        v-for="car in filteredRentedCarData"
        :key="car.id"
        class="container"
      >
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
          :class="newCar.brand && newCar.model && newCar.pricePerDay > 0 && newCar.image && newCar.from && newCar.to ? '' : 'disabled'"
        >
          Add Car
        </button>
      </form>
    </div>
  </div>
</template>

<style body></style>
