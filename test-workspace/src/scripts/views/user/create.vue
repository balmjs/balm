<template>
  <div class="page--user user-create">
    <fieldset>
      <legend>Create a new user</legend>
      <p>
        <input type="text" v-model.trim="user.name" @keyup.enter="onCreate">
      </p>
      <p>
        <button type="button" @click="$router.back()">Back</button>
        <button type="button" @click="onCreate">Save</button>
      </p>
    </fieldset>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  metaInfo: {
    titleTemplate: '%s - Create'
  },
  data() {
    return {
      user: {
        name: ''
      }
    };
  },
  methods: {
    ...mapActions(['addUser']),
    async onCreate() {
      if (this.user.name) {
        // add
        await this.addUser(this.user);
        // clear
        this.user.name = '';
        // back
        this.$router.push('/user/list');
      }
    }
  }
};
</script>
