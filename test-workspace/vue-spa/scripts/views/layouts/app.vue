<template>
  <div class="container">
    <img :src="logo" alt />
    <!-- <img :src="require('@/assets/logo.png')" alt /> -->
    <hello></hello>
  </div>
</template>

<script>
import Hello from '@/views/components/hello';
import logo from '@/assets/logo.png';

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
