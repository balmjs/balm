<template>
  <img :src="logo" alt />
  <hello></hello>
</template>

<script>
import logo from '@/assets/logo.png';
// import Hello from '@/views/components/hello';
const Hello = () => import('@/views/components/hello');

export default {
  name: 'App',
  components: {
    Hello
  },
  setup() {
    return {
      logo
    };
  }
};
</script>
