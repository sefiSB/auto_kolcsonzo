<script setup>
import { ref, onMounted } from "vue";
import { useCarStore } from "../stores/carStore";
import { useRouter } from "vue-router";

const router = useRouter();
//const carStore = useCarStore();

const fromDate = ref(null);
const toDate = ref(null);

onMounted(() => {
  //console.log(carStore.carData);
});

function buttonClicked() {
  localStorage.setItem("fromDate", fromDate.value);
  localStorage.setItem("toDate", toDate.value);
  router.push({ path: "/carlist" });
}
</script>

<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-info-subtle px-5 fixed-top"
  >
    <router-link to="/" class="nav-link"
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
        <label for="fromdate">Start date</label>
        <input
          id="fromdate"
          v-model="fromDate"
          class="form-control mr-sm-2 mx-3"
          type="date"
          placeholder="Kezdő dátum"
        />
        <label for="todate">End date</label>
        <input
          id="todate"
          v-model="toDate"
          class="form-control mr-sm-2 mx-3"
          type="date"
          placeholder="Záró dátum"
        />
        <button
          @click.prevent="buttonClicked"
          v-bind:class="
            fromDate && toDate && fromDate < toDate ? '' : 'disabled'
          "
          class="btn btn-secondary my-2 my-sm-0 mx-3"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  </nav>

  <section class="pt-5 mt-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 text-center">
          <h1
            class="display-4 fw-bold mb-4 text-primary border-bottom border-primary pb-3"
          >
            Welcome to Car Rental Service
          </h1>
          <p class="lead mb-4">
            Please select your rental period and click
            <span class="fw-semibold">"Search"</span> to find available cars.
          </p>
        </div>
      </div>
    </div>
  </section>
  <form @submit.prevent="buttonClicked" class="container">
    <div class="row g-3 justify-content-center mt-4">
      <div class="col-12 col-md-5 col-lg-4">
        <div class="form-floating">
          <input
            type="date"
            id="fromdate"
            v-model="fromDate"
            class="form-control"
            placeholder="Start date"
          />
          <label for="fromdate">Start date</label>
        </div>
      </div>
      <div class="col-12 col-md-5 col-lg-4">
        <div class="form-floating">
          <input
            type="date"
            id="todate"
            v-model="toDate"
            class="form-control"
            placeholder="End date"
          />
          <label for="todate">End date</label>
        </div>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 d-flex justify-content-center">
        <button
          type="submit"
          class="btn btn-primary btn-lg"
          :disabled="!(fromDate && toDate && fromDate < toDate)"
        >
          <i class="bi bi-search me-1"></i>
          Search
        </button>
      </div>
    </div>
  </form>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
