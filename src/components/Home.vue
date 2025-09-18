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
  /* carStore.filterCars(fromDate.value, toDate.value);
  carStore.currentFrom = fromDate.value;
  carStore.currentTo = toDate.value; */
  localStorage.setItem("fromDate", fromDate.value);
  localStorage.setItem("toDate", toDate.value);
  router.push({ path: "/carlist" });
}
</script>

<template>
  <div class="row mb-3">
    <div class="col">
      <label for="fromdate" class="form-label">Rent from:</label>
      <input
        v-model="fromDate"
        type="date"
        class="form-control"
        id="fromdate"
      />
    </div>
    <div class="col">
      <label for="todate" class="form-label">Rent to:</label>
      <input v-model="toDate" type="date" class="form-control" id="todate" />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <button
        @click="buttonClicked"
        v-bind:class="fromDate && toDate && fromDate < toDate ? '' : 'disabled'"
        class="btn btn-primary"
      >
        Search
      </button>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
