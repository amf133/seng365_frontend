<template>
  <nav class="navbar navbar-dark bg-dark">
    <!-- Left pannel -->
    <a
      class="navbar-brand"
      href="javascript:"
      v-on:click="$router.push({ name: 'home' })"
      >Home</a
    >

    <!-- Middle pannel when logged in -->
    <form v-if="isLoggedIn" class="form-inline navbar-form">
      <input
        class="form-control mr-sm-2"
        type="search"
        placeholder="Search"
        v-model="queryString"
      />
      <button class="btn btn-outline-light" v-on:click="search()">
        Search
      </button>
    </form>

    <!-- Right pannel when logged in -->
    <form v-if="isLoggedIn" class="form-inline">
      <a class="navbar-brand" href="javascript:" v-on:click="toProfile()"
        >Profile</a
      >
      <button type="button" class="btn btn-outline-light" v-on:click="logout()">
        Logout
      </button>
    </form>

    <!-- Right pannel when logged out -->
    <form v-if="!isLoggedIn" class="form-inline">
      <button
        type="button"
        class="btn btn-outline-light"
        v-on:click="$router.push({ name: 'register' })"
      >
        Register
      </button>
      <button
        type="button"
        class="btn btn-outline-light"
        v-on:click="$router.push({ name: 'login' })"
      >
        Login
      </button>
    </form>
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