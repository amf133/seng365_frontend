<template>
  <div id="app">
    <Navbar
      :isLoggedIn="isLoggedIn"
      :userToken="userToken"
      :userId="userId"
      @logout="logout"
    />
    <router-view v-slot="{ Component }">
      <transition name="bounce" >
        <component
          :is="Component"
          :isLoggedIn="isLoggedIn"
          :userToken="userToken"
          :userId="userId"
          @login="login"
        />
      </transition>
    </router-view>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      userToken: null,
      userId: null,
      isLoggedIn: null,
    };
  },
  mounted() {
    /**
     * Run on refresh
     */
    if (localStorage.userToken && localStorage.userId) {
      this.userToken = localStorage.userToken;
      this.userId = parseInt(localStorage.userId);
      this.isLoggedIn = true;
    }
  },
  methods: {
    /**
     * Called when user is logged in
     */
    login(token, userId) {
      localStorage.userToken = token;
      localStorage.userId = userId;
      this.userToken = token;
      this.userId = userId;
      this.isLoggedIn = true;
    },
    /**
     * Do i really have to exaplain this
     */
    logout() {
      localStorage.clear();
      this.userToken = null;
      this.userId = null;
      this.isLoggedIn = false;
      this.$router.push({ name: "home" });
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}

.container {
  margin-top: 10px;
}

.bounce-enter-active {
  animation: bounce-in .2s ease-out both;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
