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
          <input
            id="email"
            v-model="email"
            class="form-control"
            maxlength="50"
            name="email"
            placeholder="Email"
            required
            type="email"
          />
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            class="form-control"
            maxlength="50"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-outline-dark my-2 my-sm-0" type="submit">
            Login
          </button>
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

      this.$emit(
        "login",
        response.data.token,
        parseInt(response.data.userId)
      );
      this.$router.push({ name: 'home' });
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
