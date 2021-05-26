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
        class="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        v-model="queryString"
      />

      <el-button type="default" icon="el-icon-search" v-on:click="search()"
        >Search</el-button
      >
    </form>

    <!-- Right pannel when logged in -->
    <el-button-group v-if="isLoggedIn">
      <el-button
        v-on:click="toProfile()"
        type="default"
        icon="el-icon-user"
        >Profile</el-button
      >
      <el-button v-on:click="logout()" type="danger" icon="el-icon-switch-button"
        >Logout</el-button
      >
    </el-button-group>

    <!-- Right pannel when logged out -->
    <el-button-group v-if="!isLoggedIn">
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
    userId: Number,
  },

  methods: {
    /**
     * Logs user out
     */
    async logout() {
      this.sendLogoutRequest();
      this.$emit("logout");
    },

    /**
     * Load search page with query or emptySearch page with no query
     */
    search() {
      if (this.queryString.length <= 0) {
        this.$router.push({ name: "searchEmpty" });
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

    /**
     * Sends logout request to server
     */
    sendLogoutRequest() {
      this.axios.post(
        `http://localhost:4941/api/v1/users/logout`,
        {},
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
    },

    /**
     * Redirects to profile
     */
    toProfile() {
      let userId = this.userId;
      let args = {
        name: "profile",
        params: {
          userId,
        },
      };
      this.$router.push(args);
    },
  },
};
</script>