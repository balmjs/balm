<template>
  <div class="page--a">
    <h2>Page A</h2>
    {{ options }}
  </div>
</template>

<script>
export default {
  name: 'page-a',
  props: {
    options: Object
  }
};
</script>

<style scoped>
.page--a {
  background: red;
}
</style>
