<template>
  <div class="container">
    <form v-on:submit.prevent="login">
      <el-row type="flex" justify="center">
        <h1 class="text-center">Login</h1>
      </el-row>
      <el-row class="mb-4">
        <label>Email</label>
        <el-input
          required
          type="email"
          placeholder="Email"
          v-model="email"
        ></el-input>
      </el-row>
      <el-row class="mb-4">
        <label>Password</label>
        <el-input
          required
          type="password"
          placeholder="Password"
          v-model="password"
        ></el-input>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button native-type="submit" type="success" plain>Login</el-button>
      </el-row>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login",
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
      let data = {
        email: this.email,
        password: this.password,
      };
      await this.axios
        .post(`/users/login`, data)
        .then(
          (response) => {
            this.$emit(
              "login",
              response.data.token,
              parseInt(response.data.userId)
            );
            this.$router.push({ name: "home" });
          },
          (error) => {
            this.$notify.error({
              title: "Error",
              message: error.response.statusText,
            });
          }
        );
    },
  },
};
</script>
