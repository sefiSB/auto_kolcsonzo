<script setup>
import { ref, onMounted } from "vue";
import { useCarStore } from "../stores/carStore";
const carStore = useCarStore();

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
  carStore.rentCar(activeIdx.value);
  activeIdx.value = 0;
  user.value = {
    name: "",
    email: "",
    address: "",
    phone: "",
    duration: 0,
  };
  console.log(carStore.rentedCars);
}

onMounted(() => {
  console.log(carStore.filteredCarData);
  console.log((Date.parse(carStore.currentTo)-Date.parse(carStore.currentFrom))/ (1000 * 60 * 60 * 24));
});
</script>

<template>
  <h1>Car List Component</h1>
  <div v-for="car in carStore.filteredCarData" class="container">
    <div :key="car.id" class="row align-items-center mb-2">
      <div class="col-sm">
        <span class="fw-bold">{{ car.brand }}</span>
        <span class="ms-2">{{ car.model }}</span>
      </div>
      <div class="col-sm"><img :src="car.image" alt=""></div>
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
          Rent car for {{ (Date.parse(carStore.currentTo)-Date.parse(carStore.currentFrom))/ (1000 * 60 * 60 * 24)*car.pricePerDay }} $
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
