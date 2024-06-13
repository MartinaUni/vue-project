
import { createApp } from 'vue'

import App from './App.vue'

// Importa BootstrapVueNext
import BootstrapVueNext from 'bootstrap-vue-next'
// Importa i CSS di Bootstrap e BootstrapVue

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

const app=createApp(App);
app.config.productionTip = false;
// Usa BootstrapVueNext
app.use(BootstrapVueNext);

app.mount('#app');







