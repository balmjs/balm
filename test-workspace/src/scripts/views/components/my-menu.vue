<template>
  <nav class="menu-container">
    <ul class="my-menu">
      <li v-for="item in menu">
        <router-link :to="item.url">{{ item.name }}</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'my-menu',
  computed: {
    ...mapGetters(['menu'])
  },
  created() {
    if (!this.menu.length) {
      this.getMenu();
    }
  },
  methods: {
    ...mapActions(['getMenu'])
  }
};
</script>
