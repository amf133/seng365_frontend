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
        <button class="btn btn-outline-dark my-2 my-sm-0" v-on:click="$router.push({ name: 'createEvent' })">
            Create event
        </button>
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
};
</script>
