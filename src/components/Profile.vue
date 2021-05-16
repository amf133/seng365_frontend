<template>
  <div class="container">
    <form class="slightly-transparent-inputs">
      <div class="row mb-4">
        <div class="col text-center">
          <h1>Profile</h1>
        </div>
      </div>
      <div class="row">
        <div class="col text-center">
          <img
            id="image"
            height="200"
            :src="image"
            alt="AdminImage"
            class="mb-2"
            onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
          />
        </div>
        <div class="col form-group">
          <label for="fName">First name</label>
          <input
            id="fName"
            v-model="fName"
            class="form-control mb-4"
            :disabled="!isUser"
            maxlength="50"
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
            name="lName"
            placeholder="Last name"
            type="text"
          />
        </div>
      </div>
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
          <label for="password">Password</label>
          <input
            id="password"
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
      <div class="row" v-if="isUser">
        <div class="col">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Edit
          </button>
        </div>
        <div class="col">
          <button class="btn btn-outline-danger my-2 my-sm-0" type="submit">
            Cancel
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
      isUser: false,
      image: "",
    };
  },
  props: {
    viewingUserId: Number,
    userToken: String,
    userId: Number,
  },
  async mounted() {
    // Order matters here
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
  },
};
</script>