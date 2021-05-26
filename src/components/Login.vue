<template>
  <div class="container">
    <form
      class="slightly-transparent-inputs"
      method="POST"
      v-on:submit.prevent="login"
    >
      <div class="row">
        <div class="col text-center">
          <h1>Login</h1>
        </div>
      </div>
      <div class="row">
        <div class="form-group required col-12">
          <label for="email">Email</label>
          <el-input required type="email" placeholder="Email" v-model="email"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label for="password">Password</label>
          <el-input required type="password" placeholder="Password" v-model="password"></el-input>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <el-button native-type="submit" type="success" plain>Login</el-button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    isLoggedIn: Boolean,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    /**
     * Logs user in
     */
    async login() {
      let response = await this.sendLoginRequest();

      // Prevent further code from running on error
      if (response.error) {
        return;
      }

      this.$emit("login", response.data.token, parseInt(response.data.userId));
      this.$router.push({ name: "home" });
    },
    /**
     * Sends request to server, returns response
     */
    async sendLoginRequest() {
      let data = {
        email: this.email,
        password: this.password,
      };

      let response = await this.axios
        .post(`http://localhost:4941/api/v1/users/login`, data)
        .then(
          (response) => {
            return response;
          },
          (error) => {
            alert(error.response.statusText);
            return {
              error: true,
            };
          }
        );
      return response;
    },
  },
};
</script>
