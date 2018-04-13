<template>
  <div class="page--user user-list">
    <h2>User list</h2>
    <p>
      <router-link to="/user/create">Add new user</router-link>
    </p>
    <table v-if="users.length" class="userdata">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users">
          <td>{{ user.id }}</td>
          <td>{{ user.name }}</td>
          <td>
            <router-link class="fa fa-edit" :to="`/user/${user.id}/edit`">Edit</router-link>
            <i class="fa fa-remove" @click="onDelete(user)">Delete</i>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="no-data">No data</p>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  metaInfo: {
    titleTemplate: '%s - List'
  },
  computed: {
    ...mapGetters({
      users: 'allUsers'
    })
  },
  created() {
    if (!this.users.length) {
      this.getAllUsers();
    }
  },
  methods: {
    ...mapActions(['getAllUsers', 'removeUser']),
    async onDelete(user) {
      if (confirm(`Are your sure to delete ${user.name}`)) {
        await this.removeUser(user.id);
      }
    }
  }
};
</script>
