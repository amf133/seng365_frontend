<template>
  <div class="container">
    <div class="row" v-if="!isLoggedIn">
      <div class="col">
        <h1 class="text-center">Please log in!</h1>
      </div>
    </div>
    <div class="row mb-4" v-if="isLoggedIn">
      <div class="col text-center">
        <h1 class="">Welcome!</h1>
      </div>
    </div>
    <div class="row" v-if="isLoggedIn">
      <div class="col text-center">
        <el-button-group>
          <el-button v-on:click="$router.push({ name: 'createEvent' })" type="success">
            Create event
          </el-button>
          <el-button
            type="warning"
            v-on:click="viewMyEvents()"
          >
            My events
          </el-button>
        </el-button-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  props: {
    isLoggedIn: Boolean,
  },

  methods: {
    viewMyEvents() {
      let args = {
        name: "searchEmpty",
        params: {
          myEvents: true,
        },
      };
      this.$router.push(args);
    },
  },
};
</script>
