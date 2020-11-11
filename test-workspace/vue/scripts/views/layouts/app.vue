<template>
  <div class="container">
    <img :src="logo" alt />
    <!-- <img :src="require('@/assets/logo.png')" alt /> -->
    <hello></hello>
  </div>
</template>

<script>
import logo from '@/assets/logo.png';
// import Hello from '@/views/components/hello';
const Hello = () => import('@/views/components/hello');

export default {
  name: 'app',
  components: {
    Hello
  },
  data() {
    return {
      logo
    };
  }
};
</script>
