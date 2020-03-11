<template>
  <div class="demo--top-app-bar">
    <ui-top-app-bar
      contentSelector="#content-main"
      :title="title"
      @nav="$balmUI.onShow('openDrawer')"
    >
      <template #toolbar="{ toolbarItemClass }">
        <ui-icon-a :class="toolbarItemClass" icon="file_download"></ui-icon-a>
        <ui-icon-a :class="toolbarItemClass" icon="print"></ui-icon-a>
        <ui-icon-a :class="toolbarItemClass" icon="bookmark"></ui-icon-a>
      </template>
    </ui-top-app-bar>

    <ui-drawer type="modal" v-model="openDrawer">
      <ui-drawer-header
        :innerClass="[$themeColor('on-primary'), $themeColor('primary-bg')]"
      >
        <ui-drawer-title>Header here</ui-drawer-title>
      </ui-drawer-header>
      <ui-drawer-content>
        Nav List
        <ui-button>Button</ui-button>
      </ui-drawer-content>
    </ui-drawer>

    <ui-drawer-backdrop></ui-drawer-backdrop>

    <div id="content-main">
      <p v-for="i in 36" :key="i">
        Content
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      title: 'Hello BalmUI',
      openDrawer: false
    };
  }
};
</script>
