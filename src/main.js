import { createApp } from 'vue'
import App from './App.vue'
import { createWebHistory, createRouter } from "vue-router";
import Home from "./components/Home.vue";
import Carlist from "./components/Carlist.vue";
import Admin from "./components/Admin.vue";
import ModifyCar from './components/ModifyCar.vue';
import './style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createPinia } from 'pinia'

const pinia = createPinia()

const routes = [
  { path: "/", component: Home },
  { path: "/carlist", component: Carlist },
  {path: "/admin", component:Admin},
  {path: "/modifycar", component: ModifyCar}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
