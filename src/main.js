import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// One imoport bootstrsap
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";  
// Two import normailze
import "normalize.css"
createApp(App).use(store).use(router).mount("#app");
