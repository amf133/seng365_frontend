<template>
  <div class="container">
    <form
      class="slightly-transparent-inputs"
      v-on:submit.prevent="register"
    >
      <div class="row mb-4">
        <div class="col text-center">
          <h1>Register user</h1>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col text-center">
          <h4>Upload image (optional)</h4>
          <input
            type="file"
            accept="image/*"
            @change="uploadImage($event)"
            id="file-input"
          />
        </div>
        <div class="col form-group">
          <label for="fName">First name</label>
          <input
            id="fName"
            v-model="fName"
            class="form-control mb-4"
            maxlength="50"
            minlength="1"
            name="fName"
            placeholder="First name"
            required
            type="text"
          />
          <label for="lName" class="control-label">Last name</label>
          <input
            id="lName"
            v-model="lName"
            class="form-control"
            maxlength="50"
            minlength="1"
            name="lName"
            placeholder="Last name"
            required
            type="text"
          />
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
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
            minlength="8"
          />
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-outline-dark my-2 my-sm-0" type="submit">
            Register
          </button>
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
    async register() {
      // First registers the user then logs into the account to receive a userToken
      let data = {
        firstName: this.fName,
        lastName: this.lName,
        email: this.email,
        password: this.password,
      };

      // Register user
      let registerResponse = await this.axios
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

      // Prevent further code from running on error
      if (registerResponse.error) {
        return;
      }

      // Log in user
      delete data["firstName"];
      delete data["lastName"];
      let loginResponse = await this.axios
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

      // Prevent further code from running on error
      if (loginResponse.error) {
        return;
      }

      let userId = loginResponse.data.userId;
      await this.$emit("login", loginResponse.data.token, userId);

      // PUT event image
      if (this.image) {
        await this.postUserImage(userId, this.image)
          .then((response) => {
            alert("SUCCESS!", response);
            this.$router.push({ name: "home" });
          })
          .catch((error) => {
            alert(error.response.statusText);
            this.$router.push({ name: "home" });
            return;
          });
      } else {
        alert("SUCCESS!");
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
