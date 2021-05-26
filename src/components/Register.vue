<template>
  <div class="container">
    <form class="slightly-transparent-inputs" v-on:submit.prevent="register">
      <el-row type="flex" justify="center">
        <h1>Register user</h1>
      </el-row>
      <el-row>
        <el-col :span="12" type="flex" align="middle">
          <!-- Image upload -->
          <el-upload
            class="avatar-uploader"
            action="/"
            ref="upload"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :http-request="putImage"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <el-row class="mb-4">
            <label>First name</label>
            <el-input
              required
              placeholder="First name"
              v-model="fName"
            ></el-input>
          </el-row>
          <el-row>
            <label class="control-label">Last name</label>
            <el-input
              required
              placeholder="Last name"
              v-model="lName"
            ></el-input>
          </el-row>
        </el-col>
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
          minlength="8"
          required
          type="password"
          placeholder="Password"
          v-model="password"
        ></el-input>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button native-type="submit" type="success" plain
          >Register</el-button
        >
      </el-row>
    </form>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 200px;
  height: 200px;
  display: block;
}
</style>

<script>
export default {
  name: "Register",
  props: {
    userToken: String,
    userId: Number,
  },
  data() {
    return {
      fName: "",
      lName: "",
      email: "",
      password: "",
      image: null,
    };
  },
  methods: {
    /**
     * Registers a user then logs them in
     */
    async register() {
      let data = {
        firstName: this.fName,
        lastName: this.lName,
        email: this.email,
        password: this.password,
      };
      let registerResponse = await this.postUser(data);

      // Prevent further code from running on error
      if (registerResponse.error) {
        return;
      }
      delete data["firstName"];
      delete data["lastName"];
      let loginResponse = await this.loginUser(data);

      // Prevent further code from running on error
      if (loginResponse.error) {
        return;
      }
      await this.$emit(
        "login",
        loginResponse.data.token,
        loginResponse.data.userId
      );
      // Tells el-upload to submit image
      this.$refs.upload.submit();
      this.$router.push({ name: "home" });
    },
    
    /**
     * Sends POST request to register new user
     */
    async postUser(data) {
      let response = await this.axios
        .post(`http://localhost:4941/api/v1/users/register`, data)
        .then(
          (response) => {
            return response;
          },
          (error) => {
            this.$notify.error({
              title: "Error",
              message: error.response.statusText,
            });
            return {
              error: true,
            };
          }
        );
      return response;
    },

    /**
     * Sends POST request to login user
     */
    async loginUser(data) {
      let response = await this.axios
        .post(`http://localhost:4941/api/v1/users/login`, data)
        .then(
          (response) => {
            return response;
          },
          (error) => {
            this.$notify.error({
              title: "Error",
              message: error.response.statusText,
            });
            return {
              error: true,
            };
          }
        );
      return response;
    },

    /**
     * Sends PUT to server for event image
     */
    async putImage(image) {
      return await this.axios
        .put(`http://localhost:4941/api/v1/users/${this.userId}/image`, image.file, {
          headers: {
            "X-Authorization": this.userToken,
            "Content-Type": image.file.type,
          },
        })
        .catch((error) => {
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
    },
  },
};
</script>
