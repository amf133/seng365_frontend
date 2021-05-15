<template>
  <el-row v-if="!isLoggedIn" justify="center">
    <el-col :span="24">
      <h1 class="text-center">Please log in!</h1>
    </el-col>
  </el-row>
  <el-row v-else justify="center">
    <el-col :span=24>
      <h1 class="text-center">Welcome!</h1>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Home",
  props: {
    isLoggedIn: Boolean,
  },
};
</script>
