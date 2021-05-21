<template>
  <div class="container mt-4">
    <form class="slightly-transparent-inputs" v-on:submit.prevent="editProfile">
      <div class="row">
        <div class="col text-center">
          <!-- Image -->
          <el-image
            style="width: 300px; height: 300px"
            :src="image"
            fit="cover"
            class="rounded-circle"
            onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
          ></el-image>
        </div>
        <!-- First and last name inputs -->
        <div class="col form-group">
          <label for="fName">First name</label>
          <input
            id="fName"
            v-model="fName"
            class="form-control mb-4"
            :disabled="!isUser"
            maxlength="50"
            minlength="1"
            name="fName"
            placeholder="First name"
            type="text"
          />
          <label for="lName" class="control-label">Last name</label>
          <input
            id="lName"
            v-model="lName"
            class="form-control"
            :disabled="!isUser"
            maxlength="50"
            minlength="1"
            name="lName"
            placeholder="Last name"
            type="text"
          />
          <!-- Image upload -->
          <div class="input-group mb-3 mt-5">
            <div v-if="!uploadedImage"  class="custom-file">
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
            <h4 v-else>Image uploaded {{ uploadedImage.name }}</h4>
          </div>
        </div>
      </div>
      <!-- Email and password fields, only shown if profile is the logged in users -->
      <div class="row" v-if="isUser">
        <div class="col form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            class="form-control"
            maxlength="50"
            name="email"
            placeholder="Email"
            type="email"
          />
        </div>
      </div>
      <div class="row" v-if="isUser">
        <div class="col form-group">
          <label for="password">Current password</label>
          <input
            id="currentPassword"
            v-model="currentPassword"
            class="form-control mb-3"
            maxlength="50"
            name="password"
            placeholder="Password"
            type="password"
            minlength="8"
          />
          <label for="password">New password</label>
          <input
            id="newPassword"
            v-model="password"
            class="form-control"
            maxlength="50"
            name="password"
            placeholder="Password"
            type="password"
            minlength="8"
          />
        </div>
      </div>
      <!-- Submit button -->
      <div class="row" v-if="isUser">
        <div class="col">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "Profile",

  data() {
    return {
      fName: "",
      lName: "",
      email: "",
      password: "",
      currentPassword: "",
      isUser: false,
      image: null,
      uploadedImage: null,
    };
  },

  props: {
    viewingUserId: Number,
    userToken: String,
    userId: Number,
  },

  async mounted() {
    await this.setIsUser();
    this.populateFields();
  },

  methods: {
    /**
     * Populates the profile with the users information
     */
    async populateFields() {
      // Set user fields
      await this.getUser()
        .then((response) => {
          let user = response.data;
          this.fName = user.firstName;
          this.lName = user.lastName;
          if (user.email) {
            this.email = user.email;
          }
        })
        .catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });

      // Set users image
      this.image = `http://localhost:4941/api/v1/users/${this.viewingUserId}/image`;
    },

    /**
     * Returns true if the profile is for the logged in user
     */
    async setIsUser() {
      if (this.viewingUserId == this.userId) {
        this.isUser = true;
      }
    },

    /**
     * Returns the user of the profile we are viewing
     */
    async getUser() {
      return await this.axios.get(
        `http://localhost:4941/api/v1/users/` + this.viewingUserId,
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
    },

    /**
     * Function called when submit button is clicked
     */
    async editProfile() {
      let data = this.getData();
      if (data.error) {
        return;
      }
      let registerResponse = await this.patchUser(data);

      // Prevent further code from running on error
      if (registerResponse.error) {
        return;
      }

      this.putImage();
    },

    /**
     * Returns user data to be sent in a request to the API
     */
    getData() {
      let data = {
        firstName: this.fName,
        lastName: this.lName,
        email: this.email,
      };

      if (this.password != "" || this.currentPassword != "") {
        data["password"] = this.password;
        data["currentPassword"] = this.currentPassword;
      }
      return data;
    },

    /**
     * Sends patch request with user data to API
     */
    async patchUser(data) {
      let response = await this.axios
        .patch(`http://localhost:4941/api/v1/users/${this.userId}`, data, {
          headers: {
            "X-Authorization": this.userToken,
          },
        })
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
     * Sends put request to API if user uploaded a new image
     */
    async putImage() {
      if (this.uploadedImage) {
        await this.postUserImage(this.userId)
          .then((response) => {
            alert("SUCCESS!", response);
            this.$router.go();
          })
          .catch((error) => {
            alert(error.response.statusText);
            this.$router.go();
            return;
          });
      } else {
        alert("SUCCESS!");
        this.$router.go();
      }
    },

    /**
     * Called after uploading an image
     */
    uploadImage(e) {
      this.uploadedImage = e.target.files[0];
    },

    /**
     * Sends POST to server for event image
     */
    async postUserImage(userId) {
      return await this.axios.put(
        `http://localhost:4941/api/v1/users/${userId}/image`,
        this.uploadedImage,
        {
          headers: {
            "X-Authorization": this.userToken,
            "Content-Type": this.uploadedImage.type,
          },
        }
      );
    },
  },
};
</script>