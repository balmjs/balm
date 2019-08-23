<template>
  <div class="container">
    <img :src="logo" alt />
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
