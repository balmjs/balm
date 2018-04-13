<template>
  <div class="my-hello">
    <h1>{{ msg }}</h1>
    <p>thx <a href="//balmjs.com/">BalmJS</a></p>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data() {
    return {
      msg: 'Hello Vue App'
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
