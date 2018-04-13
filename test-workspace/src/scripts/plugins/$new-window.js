import newWindow from '../views/components/new-window';

export default {
  install(Vue) {
    Vue.prototype.$newWindow = new Vue({
      components: {
        newWindow
      },
      data() {
        return {
          show: false,
          componentName: '',
          componentOptions: null
        };
      },
      methods: {
        open(componentName = '', componentOptions = {}) {
          this.componentName = componentName;
          this.componentOptions = componentOptions;
          this.show = true;
        },
        close() {
          this.show = false;
        }
      },
      template:
        '<new-window v-if="show" :componentName="componentName" :componentOptions="componentOptions" @close="close"></new-window>'
    }).$mount('#new-window');
  }
};
