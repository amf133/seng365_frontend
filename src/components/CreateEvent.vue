<template>
  <div class="container">
    <form v-on:submit.prevent="createEvent">
      <el-row type="flex" justify="center">
        <h1 v-if="eventId == null">Create event</h1>
        <h1 v-else>Edit event</h1>
      </el-row>
      <el-row class="mb-4">
        <label>Title</label>
        <el-input required placeholder="Title" v-model="title"></el-input>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <label>Venue</label>
          <el-input placeholder="Venue" v-model="venue" class="mb-4"></el-input>

          <label>Url</label>
          <el-input placeholder="Url" v-model="url"></el-input>
        </el-col>
        <!-- Multiple select element plus object -->
        <el-col :span="6" type="flex" align="middle">
          <!-- Image upload -->
          <el-upload
            class="avatar-uploader"
            action="/"
            ref="upload"
            :auto-upload="false"
            :limit="1"
            accept="image/*"
            :http-request="putEventImage"
          >
            <el-image
              class="avatar"
              :src="image"
              @error="image = null"
              fit="cover"
              v-if="image"
            >
            </el-image>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <!-- Date input -->
          <el-row>
            <label>Date</label>
          </el-row>
          <el-date-picker
            v-model="date"
            type="datetime"
            placeholder="Select date and time"
            format="YYYY-MM-DD HH:mm:ss"
            class="mb-4"
          >
          </el-date-picker>
          <el-row>
            <label class="mr-2">Categories</label>
          </el-row>
          <el-select
            id="categories"
            v-model="categories"
            multiple
            collapse-tags
            placeholder="Select"
          >
            <el-option
              v-for="item in categoriesData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb-4" :gutter="20" type="flex" align="middle">
        <el-col :span="6">
          <label>Fee $</label>
          <el-input
            type="number"
            step="0.01"
            min="0.0"
            placeholder="Fee $"
            v-model="fee"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <label>Capacity</label>
          <el-input
            min="0"
            type="number"
            placeholder="Capacity"
            v-model="capacity"
          ></el-input>
        </el-col>
        <!-- Check boxes -->
        <el-col :span="12">
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Is online</label
          >
          <el-switch
            v-model="isOnline"
            active-color="#13ce66"
            inactive-color="#ff4949"
            class="mr-4"
          >
          </el-switch>
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Requires attendance control</label
          >
          <el-switch
            v-model="requiresAttendanceControl"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-col>
      </el-row>
      <el-row class="mb-4">
        <label>Description</label>
        <el-input
          required
          type="textarea"
          placeholder="Description"
          v-model="description"
        ></el-input>
      </el-row>
      <el-row type="flex" justify="center">
        <el-button
          v-if="eventId == null"
          native-type="submit"
          type="success"
          plain
          >Create event</el-button
        >
        <button
          v-else
          class="btn btn-outline-success my-2 my-sm-0"
          type="submit"
        >
          Edit event
        </button>
      </el-row>
    </form>
  </div>
</template>

<script>
var dateFormat = require("dateformat");
export default {
  name: "createEvent",
  data() {
    return {
      title: null,
      venue: null,
      url: null,
      image: null,
      date: null,
      categories: null,
      categoriesData: null,
      fee: null,
      capacity: null,
      isOnline: false,
      requiresAttendanceControl: false,
      description: null,
      newEventId: null,
    };
  },
  props: {
    userToken: String,
    eventId: String,
  },
  mounted() {
    this.populateCategories();
    if (this.eventId) {
      this.setAsEditEvent();
    }
  },
  methods: {
    /**
     * Calls the API and populates the list of categories based on the response
     */
    populateCategories() {
      this.axios
        .get(`http://localhost:4941/api/v1/events/categories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },

    /**
     * Validate data and send POST to API
     */
    async createEvent() {
      if (this.eventId) {
        this.editEvent();
        return;
      }
      let newEvent = this.getNewEventObject();
      // Prevent further code from being run
      if (newEvent.error) {
        return;
      }

      // POST event
      await this.postEvent(newEvent)
        .then((response) => {
          this.newEventId = response.data.eventId;
        })
        .catch((error) => {
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
          this.$router.push({ name: "home" });
          return;
        })
        .then(() => {
          this.$refs.upload.submit();
          this.$notify.success({
            title: "Success",
          });
          this.$router.push({ name: "home" });
        });
    },

    /**
     * Returns a newEvent object
     */
    getNewEventObject() {
      let newEvent = {
        title: this.title,
        description: this.description,
        isOnline: this.isOnline,
        requiresAttendanceControl: this.requiresAttendanceControl,
        categoryIds: this.categories,
      };
      if (this.date) {
        newEvent["date"] = dateFormat(this.date, "yyyy-mm-dd hh:MM:ss");
      }
      if (this.url) {
        newEvent["url"] = this.url;
      }
      if (this.venue) {
        newEvent["venue"] = this.venue;
      }
      if (this.fee) {
        newEvent["fee"] = parseFloat(this.fee);
      }
      if (this.capacity) {
        newEvent["capacity"] = parseInt(this.capacity);
      }
      return this.validateNewEvent(newEvent);
    },

    /**
     * Returns a newEvent object or an error if it doesnt pass validation
     */
    validateNewEvent(newEvent) {
      if (this.categories.length == 0) {
        this.$notify.warning({
          title: "Warning",
          message: "Please include at least one category",
        });
        newEvent = { error: true };
      } else if (this.isOnline && !this.url) {
        this.$notify.warning({
          title: "Warning",
          message: "Online events need a URL",
        });
        newEvent = { error: true };
      } else if (!this.isOnline && !this.venue) {
        this.$notify.warning({
          title: "Warning",
          message: "In person events need a venue",
        });
        newEvent = { error: true };
      } else if (!this.date) {
        this.$notify.warning({
          title: "Warning",
          message: "Date is required",
        });
        newEvent = { error: true };
      } else if (this.date < new Date()) {
        this.$notify.warning({
          title: "Warning",
          message: "Date needs to be in future",
        });
        newEvent = { error: true };
      }
      return newEvent;
    },

    /**
     * Sends POST to server for event
     */
    async postEvent(newEvent) {
      return await this.axios.post(
        `http://localhost:4941/api/v1/events/`,
        newEvent,
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
    },

    /**
     * Sends PUT to server for event image
     */
    async putEventImage(image) {
      return await this.axios.put(
        `http://localhost:4941/api/v1/events/${this.newEventId || this.eventId}/image`,
        image.file,
        {
          headers: {
            "Content-Type": image.file.type,
            "X-Authorization": this.userToken,
          },
        }
      );
    },

    /**
     * Sets the register page to act as the user is editing their business
     */
    setAsEditEvent() {
      this.axios
        .get(`http://localhost:4941/api/v1/events/${this.eventId}`)
        .then((response) => {
          let event = response.data;
          this.title = event.title;
          this.categories = event.categories;
          this.date = event.date.slice(0, 16);
          this.url = event.url;
          this.description = event.description;
          this.capacity = event.capacity;
          this.fee = event.fee;
          this.venue = event.venue;
          this.isOnline = Boolean(event.isOnline);
          this.requiresAttendanceControl = Boolean(
            event.requiresAttendanceControl
          );
          this.description = event.description;
        })
        .catch((error) => {
          this.$router.push({ name: "home" });
          this.$notify.error({
            title: "error",
            message: error.response.statusText,
          });
        });
      this.image = `http://localhost:4941/api/v1/events/${this.eventId}/image`;
    },

    /**
     * Validate data and send PATCH request
     */
    async editEvent() {
      let editedEvent = this.getNewEventObject();
      // Prevent further code from being run
      if (editedEvent.error) {
        return;
      }

      // PATCH event
      await await this.axios
        .patch(
          `http://localhost:4941/api/v1/events/${this.eventId}`,
          editedEvent,
          {
            headers: {
              "X-Authorization": this.userToken,
            },
          }
        )
        .catch((error) => {
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        })
        .then(() => {
          this.$refs.upload.submit();
          this.$router.push({ name: "home" });
          this.$notify.success({
            title: "Success",
          });
        });
    },
  },
};
</script>
