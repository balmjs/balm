<template>
  <div class="page--user user-detail">
    <fieldset>
      <legend>User Detail</legend>
      <div v-if="user">
        <p>ID：{{ user.id }}</p>
        <p>Name: <input type="text" v-model.trim="user.name" @keyup.enter="onUpdate"></p>
        <p>
          <button type="button" @click="$router.back()">Back</button>
          <button type="button" @click="onUpdate">Save</button>
        </p>
      </div>
      <p v-else class="no-data">No data</p>
    </fieldset>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  metaInfo: {
    titleTemplate: '%s - Detail'
  },
  computed: {
    ...mapGetters({
      user: 'currentUser'
    })
  },
  async created() {
    let userId = this.$route.params.id;
    await this.getUser(userId);

    if (!this.user) {
      console.warn('no user data');
      this.$router.push('/user/list');
    }
  },
  beforeDestroy() {
    this.resetUser();
  },
  methods: {
    ...mapActions(['getUser', 'editUser', 'resetUser']),
    async onUpdate() {
      if (this.user.name) {
        // update
        await this.editUser(this.user);
        // back
        this.$router.push('/user/list');
      }
    }
  }
};
</script>
