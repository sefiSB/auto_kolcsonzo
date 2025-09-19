<script setup>
import { onMounted, ReactiveEffect, ref } from "vue";

const username = ref("");
const password = ref("");
const isAdmin = ref(false);
const activeTab = ref("notrented");

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
      <div v-for="car in carData" :key="car.id" class="container">
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
      </div>
    </div>

    <div v-if="activeTab == 'rented'">
      <div v-for="car in rentedCarData" :key="car.id" class="container">
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
      </div>
    </div>
    <div v-if="activeTab == 'addcar'">//TODO</div>
  </div>
</template>

<style body>
.align-top {
  align-self: flex-start;
  width: 100%;
}
</style>
