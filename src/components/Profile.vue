<template>
  <div class="container mt-4">
    <form class="slightly-transparent-inputs" v-on:submit.prevent="editProfile">
      <el-row>
        <el-col :span="8" type="flex" align="right">
          <!-- Image upload -->
          <el-upload
            class="avatar-uploader"
            action=""
            ref="upload"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :http-request="putImage"
          >
            <el-image
              class="avatar"
              :src="image"
              @error="image = null"
              v-if="image"
              fit="cover"
            >
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="4" type="flex" align="left">
          <el-button
            v-if="image"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteImage()"
          ></el-button>
        </el-col>
        <!-- First and last name fields -->
        <el-col :span="12">
          <el-row class="mb-4">
            <label>First name</label>
            <el-input placeholder="First name" v-model="fName"></el-input>
          </el-row>
          <el-row>
            <label>Last name</label>
            <el-input placeholder="Last name" v-model="lName"></el-input>
          </el-row>
        </el-col>
      </el-row>
      <!-- Email and password fields -->
      <el-row class="mb-4">
        <label>Email</label>
        <el-input type="email" placeholder="Email" v-model="email"></el-input>
      </el-row>
      <el-row class="mb-4">
        <label>Current password</label>
        <el-input
          type="password"
          placeholder="Password"
          v-model="currentPassword"
        ></el-input>
      </el-row>
      <el-row class="mb-4">
        <label>New password</label>
        <el-input
          type="password"
          placeholder="New password"
          v-model="password"
          minlength="8"
        ></el-input>
      </el-row>
      <!-- Submit button -->
      <el-row type="flex" justify="center">
        <el-button native-type="submit" type="success" plain>Submit</el-button>
      </el-row>
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
      image: null,
    };
  },
  props: {
    userToken: String,
    userId: Number,
  },
  async mounted() {
    this.populateFields();
  },
  methods: {
    /**
     * Populates profile with the users information
     */
    async populateFields() {
      // Set user fields
      await this.axios
        .get(`/users/` + this.userId, {
          headers: {
            "X-Authorization": this.userToken,
          },
        })
        .then((response) => {
          let user = response.data;
          this.fName = user.firstName;
          this.lName = user.lastName;
          this.email = user.email;
        })
        .catch((error) => {
          this.$router.push({ name: "home" });
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
      // Set users image
      this.image = `/users/${this.userId}/image`;
    },

    /**
     * Function called when submit button is clicked
     */
    async editProfile() {
      let data = {
        firstName: this.fName,
        lastName: this.lName,
        email: this.email,
      };

      // Prevents updating password if it was not supplied
      if (this.password != "" || this.currentPassword != "") {
        data["password"] = this.password;
        data["currentPassword"] = this.currentPassword;
      }

      // Send PATCH request
      await this.axios
        .patch(`/users/${this.userId}`, data, {
          headers: {
            "X-Authorization": this.userToken,
          },
        })
        .then(() => {
          // Upload image
          this.$refs.upload.submit();
          this.$notify.success({
            title: "Success",
          });
        })
        .catch((error) => {
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
    },

    /**
     * Sends PUT request
     */
    async putImage(image) {
      await this.axios.put(
        `/users/${this.userId}/image`,
        image.file,
        {
          headers: {
            "X-Authorization": this.userToken,
            "Content-Type": image.file.type,
          },
        }
      );
      this.$router.go();
    },

    /**
     * Removes a users image
     */
    async deleteImage() {
      await this.axios.delete(
        `/users/${this.userId}/image`,
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
      this.$router.go();
    }
  },
};
</script>