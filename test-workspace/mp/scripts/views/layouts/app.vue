<template>
  <div class="container">
    <header class="home-header">Hello BalmJS</header>

    <div id="content-main">
      <p v-for="i in 36" :key="i" class="nav-item">Content {{ i }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>
