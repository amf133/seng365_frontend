<template>
  <div class="container">
    <form class="slightly-transparent-inputs" v-on:submit.prevent="createEvent">
      <div class="row">
        <div class="col text-center">
          <h1 v-if="eventId == null">Create event</h1>
          <h1 v-else>Edit event</h1>
        </div>
      </div>
      <div class="row">
        <div class="col form-group">
          <label>Title</label>
          <el-input required placeholder="Title" v-model="title"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <label>Venue</label>
          <el-input placeholder="Venue" v-model="venue"></el-input>
        </div>
        <!-- Multiple select element plus object -->
        <div class="col-3 form-group required">
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
        </div>
        <div class="col-3">
          <!-- Date input -->
          <el-row>
            <label>Date</label>
          </el-row>
          <el-date-picker
            v-model="date"
            type="datetime"
            placeholder="Select date and time"
            format="YYYY-MM-DD HH:mm:ss"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="row">
        <div class="col form-group">
          <label>Url</label>
          <el-input placeholder="Url" v-model="url"></el-input>
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label>Fee $</label>
          <el-input
            type="number"
            step="0.01"
            min="0.0"
            placeholder="Fee $"
            v-model="fee"
          ></el-input>
        </div>
        <div class="col form-group required">
          <label>Capacity</label>
          <el-input
            min="0"
            type="number"
            placeholder="Capacity"
            v-model="capacity"
          ></el-input>
        </div>
      </div>
      <!-- Check boxes -->
      <div class="row align-items-center mb-3 mt-2">
        <div class="col">
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Is online</label
          >
          <el-switch
            v-model="isOnline"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <div class="col">
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Requires attendance control</label
          >
          <el-switch
            v-model="requiresAttendanceControl"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </div>
        <div class="col">
          <!-- Image upload -->
          <div class="input-group">
            <div v-if="!image" class="custom-file">
              <input
                type="file"
                class="custom-file-input"
                id="file-input"
                @change="uploadImage($event)"
                accept="image/*"
              />
              <label class="custom-file-label">Upload image</label>
            </div>

            <h4 v-else>Image uploaded {{ image.name }}</h4>
          </div>
        </div>
      </div>
      <div class="row mb-4">
        <div class="col">
          <label>Description</label>
          <el-input
            required
            type="textarea"
            placeholder="Description"
            v-model="description"
          ></el-input>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
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
        </div>
      </div>
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
      categories: null,
      date: null,
      todayDate: null,
      url: null,
      description: null,
      capacity: null,
      fee: null,
      venue: null,
      isOnline: false,
      requiresAttendanceControl: false,
      categoriesData: null,
      image: null,
    };
  },

  props: {
    userToken: String,
    eventId: String,
  },

  beforeMount() {
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
      if (newEvent.error) {
        return;
      }

      // POST event
      let eventId;
      await this.postEvent(newEvent)
        .then((response) => {
          eventId = response.data.eventId;
        })
        .catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });

      // PUT event image
      if (this.image) {
        await this.patchEventImage(eventId, this.image).catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });
      }
      alert("SUCCESS!");
      this.$router.push({ name: "home" });
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
      ("2012-04-23 18:25:43.511");
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
      newEvent = this.validateNewEvent(newEvent);
      return newEvent;
    },

    /**
     * Returns a newEvent object or an error if it doesnt pass validation
     */
    validateNewEvent(newEvent) {
      if (this.categories.length == 0) {
        alert("Please include at least one category");
        newEvent = { error: true };
      }
      if (this.isOnline && !this.url) {
        alert("Online events need a URL");
        newEvent = { error: true };
      }
      if (!this.isOnline && !this.venue) {
        alert("In person events need a venue");
        newEvent = { error: true };
      }
      if (!this.date) {
        alert("Date is required");
        newEvent = { error: true };
      }
      if (this.date < new Date()) {
        alert("Date needs to be in future");
        newEvent = { error: true };
      }
      return newEvent;
    },

    /**
     * Called after uploading an image
     */
    uploadImage(e) {
      this.image = e.target.files[0];
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
     * Sends POST to server for event image
     */
    async patchEventImage(eventId, image) {
      return await this.axios.put(
        `http://localhost:4941/api/v1/events/${eventId}/image`,
        image,
        {
          headers: {
            "Content-Type": image.type,
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
        .catch((err) => {
          alert(err.response.statusText);
          this.$router.push({ name: "home" });
        });
    },

    /**
     * Validate data and send PUT to API
     */
    async editEvent() {
      let editedEvent = this.getNewEventObject();
      if (editedEvent.error) {
        return;
      }

      // PUT event
      await this.patchEvent(editedEvent).catch((error) => {
        alert(error.response.statusText);
        this.$router.push({ name: "home" });
        return;
      });

      // PUT event image
      if (this.image) {
        await this.patchEventImage(this.eventId, this.image).catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });
      }
      alert("SUCCESS!");
      this.$router.push({ name: "home" });
    },

    /**
     * Sends PUT request to edit event
     */
    async patchEvent(editedEvent) {
      return await this.axios.patch(
        `http://localhost:4941/api/v1/events/${this.eventId}`,
        editedEvent,
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
