import Vue from "vue";
import Vuetify, { VCard } from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify, {
  components: {
    VCard,
  },
  directives: {
    Ripple,
  },
});
const opts = {};

export default new Vuetify(opts);
