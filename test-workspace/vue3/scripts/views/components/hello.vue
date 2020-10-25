<template>
  <h1>{{ msg }}</h1>
  <p>
    thx
    <a href="//balm.js.org/">BalmJS</a>
  </p>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Hello',
  setup() {
    const msg = ref('');

    msg.value = 'Hello Vue 3.0 App';

    return {
      msg
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
