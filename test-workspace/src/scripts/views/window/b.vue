<template>
  <div class="page--b">
    <h2>Page B</h2>
    {{ options }}
  </div>
</template>

<script>
export default {
  name: 'page-b',
  props: {
    options: Object
  }
};
</script>

<style scoped>
.page--b {
  background: blue;
}
</style>
