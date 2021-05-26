<template>
  <div class="container">
    <form class="slightly-transparent-inputs" v-on:submit.prevent="register">
      <div class="row mb-4">
        <div class="col text-center">
          <h1>Register user</h1>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col text-center">
          <!-- Image upload -->
          <div class="input-group mb-3 mt-5">
            <div v-if="!image" class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="file-input"
                @change="uploadImage($event)"
                accept="image/*"
              />
              <label class="custom-file-label" for="file-input"
                >Upload image</label
              >
            </div>
            <h4 v-else>Image uploaded {{ image.name }}</h4>
          </div>
        </div>
        <div class="col form-group">
          <label for="fName">First name</label>
          <el-input
            required
            placeholder="First name"
            class="mb-2"
            v-model="fName"
          ></el-input>
          <label for="lName" class="control-label">Last name</label>
          <el-input required placeholder="Last name" v-model="lName"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label for="email">Email</label>
          <el-input required type="email" placeholder="Email" v-model="email"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label for="password">Password</label>
          <el-input minlength="8" required type="password" placeholder="Password" v-model="password"></el-input>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <el-button native-type="submit" type="success" plain
            >Register</el-button
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Register",

  props: {
    isLoggedIn: Boolean,
    userToken: String,
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

  created() {
    if (this.isLoggedIn) {
      this.$router.push({ name: "home" });
    }
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
      let userId = loginResponse.data.userId;
      await this.$emit("login", loginResponse.data.token, userId);
      await this.putImage(userId);
    },

    /**
     * Sends post request to add new user
     */
    async postUser(data) {
      let response = await this.axios
        .post(`http://localhost:4941/api/v1/users/register`, data)
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
            alert(error.response.statusText);
            return {
              error: true,
            };
          }
        );
      return response;
    },

    /**
     * Sends image to API if one was uploaded
     */
    async putImage(userId) {
      if (this.image) {
        await this.postUserImage(userId, this.image)
          .then(() => {
            this.$router.push({ name: "home" });
          })
          .catch((error) => {
            alert(error.response.statusText);
            this.$router.push({ name: "home" });
            return;
          });
      } else {
        this.$router.push({ name: "home" });
      }
    },

    /**
     * Called after uploading an image
     */
    uploadImage(e) {
      this.image = e.target.files[0];
    },

    /**
     * Sends POST to server for event image
     */
    async postUserImage(userId, image) {
      return await this.axios.put(
        `http://localhost:4941/api/v1/users/${userId}/image`,
        image,
        {
          headers: {
            "X-Authorization": this.userToken,
            "Content-Type": image.type,
          },
        }
      );
    },
  },
};
</script>
