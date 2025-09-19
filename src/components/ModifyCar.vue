<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const car = ref(null);
const fromDate = ref("");
const toDate = ref("");

onMounted(() => {
  const carId = localStorage.getItem("modifyCarId");
  console.log("Modifying car with ID:", carId);
  // Fetch car details using the carId and populate form fields for modification
  const response = fetch(`http://localhost:3000/cars/${carId}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Car data:", data);
      car.value = data;
      fromDate.value = new Date(car.value.from).toISOString().split("T")[0];
      toDate.value = new Date(car.value.to).toISOString().split("T")[0];
    })
    .catch((err) => {
      console.error("Error fetching car data:", err);
    });
});

function savechanges(){
    fetch(`http://localhost:3000/cars/${car.value.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: car.value.id,
      brand: car.value.brand,
      model: car.value.model,
      pricePerDay: car.value.pricePerDay,
      image: car.value.image,
      from: Date.parse(fromDate.value),
      to: Date.parse(toDate.value),
      user: null,
    }),}).then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      alert("Car details updated successfully!");
    })
    .catch((error) => {
      console.error("Error:", error);
    });

    localStorage.removeItem("modifyCarId");
    router.push({ path: "/admin" });
}

</script>

<template>
  <h1>Modify Car Component</h1>
  <div v-if="car">
    <h2>Modifying Car: {{ car.brand }} {{ car.model }}</h2>
    <form>
      <div class="mb-3">
        <label for="brand" class="form-label">Brand</label>
        <input
          type="text"
          class="form-control"
          id="brand"
          v-model="car.brand"
        />
      </div>
      <div class="mb-3">
        <label for="model" class="form-label">Model</label>
        <input
          type="text"
          class="form-control"
          id="model"
          v-model="car.model"
        />
      </div>
      <div class="mb-3">
        <label for="pricePerDay" class="form-label">Price Per Day</label>
        <input
          type="number"
          class="form-control"
          id="pricePerDay"
          v-model="car.pricePerDay"
        />
      </div>
      <div class="mb-3">
        <label for="image" class="form-label">Image URL</label>
        <input
          type="text"
          class="form-control"
          id="image"
          v-model="car.image"
        />
      </div>
      <div class="mb-3">
        <label for="from" class="form-label">Available From</label>
        <input type="date" class="form-control" id="from" v-model="fromDate" />
      </div>
      <div class="mb-3">
        <label for="to" class="form-label">Available To</label>
        <input type="date" class="form-control" id="to" v-model="toDate" />
      </div>
        <button @click="savechanges" type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
