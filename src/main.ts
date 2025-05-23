import { createApp } from "vue";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import VueGridLayout from "vue-grid-layout-v3";

const app = createApp(App);
app.use(VueGridLayout);
const pinia = createPinia();

app.use(pinia);
app.mount("#app");
