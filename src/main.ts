import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VirtualScroller from 'vue3-virtual-scroller';
import 'vue3-virtual-scroller/dist/vue3-virtual-scroller.css';

const app = createApp(App)
app.use(router)
app.use(VirtualScroller);
app.mount('#app')
