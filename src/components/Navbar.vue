<template>
  <nav class="navbar navbar-dark bg-secondary">
    <!-- Left pannel -->
    <a
      class="navbar-brand"
      href="javascript:"
      v-on:click="$router.push({ name: 'home' })"
      >Home</a
    >

    <!-- Middle pannel when logged in -->
    <form
      v-if="isLoggedIn"
      class="form-inline navbar-form"
      v-on:submit.prevent="search()"
    >
      <input
        class="form-control mr-2"
        type="search"
        placeholder="Search events"
        v-model="queryString"
      />
      <el-button type="default" icon="el-icon-search" v-on:click="search()"
        >Search</el-button
      >
    </form>

    <!-- Right pannel when logged in -->
    <el-button-group v-if="isLoggedIn">
      <el-button
        v-on:click="$router.push({ name: 'profile' })"
        type="default"
        icon="el-icon-user"
        >Profile</el-button
      >
      <el-button
        v-on:click="logout()"
        type="danger"
        icon="el-icon-switch-button"
        >Logout</el-button
      >
    </el-button-group>

    <!-- Right pannel when logged out -->
    <el-button-group v-else>
      <el-button v-on:click="$router.push({ name: 'register' })" type="default"
        >Register</el-button
      >
      <el-button v-on:click="$router.push({ name: 'login' })" type="primary"
        >Login</el-button
      >
    </el-button-group>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      queryString: "",
    };
  },
  props: {
    isLoggedIn: Boolean,
    userToken: String,
  },
  methods: {
    /**
     * Logs user out
     */
    async logout() {
      this.axios
        .post(
          `/users/logout`,
          {},
          {
            headers: {
              "X-Authorization": this.userToken,
            },
          }
        )
        .then(() => {
          this.$emit("logout");
        });
    },

    /**
     * Load search page with search query
     */
    search() {
      if (this.queryString.length <= 0) {
        if (this.$route.name == "searchMyEvents") {
          this.$router.go();
        } else {
          this.$router.push({ name: "searchEmpty" });
        }
      } else {
        let args = {
          name: "search",
          params: {
            queryString: this.queryString,
          },
        };
        this.$router.push(args);
      }
    },
  },
};
</script>