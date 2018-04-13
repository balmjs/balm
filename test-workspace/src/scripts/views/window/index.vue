<template>
  <div>
    <button type="button" @click="openNewWindow()">Open New Window</button>
    <button type="button" @click="openNewWindow('page-a', 'Hello')">Open A Window</button>
    <button type="button" @click="openNewWindow('page-b', 'World')">Open B Window</button>
  </div>
</template>

<script>
export default {
  methods: {
    openNewWindow(page = '', msg = '') {
      this.$newWindow.open(page, {
        msg
      });
    }
  }
};
</script>
