<template>
  <div class="container">
    <form
      class="slightly-transparent-inputs"
      v-on:submit.prevent="createEvent"
    >
      <div class="row">
        <div class="col text-center">
          <h1>Create event</h1>
        </div>
      </div>
      <div class="row">
        <div class="col form-group">
          <label for="title">Title</label>
          <input
            id="title"
            v-model="title"
            class="form-control"
            maxlength="50"
            name="title"
            placeholder="Title"
            required
            type="text"
          />
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="venue">Venue</label>
          <input
            id="venue"
            v-model="venue"
            class="form-control"
            name="venue"
            placeholder="Venue"
          />
        </div>
        <!-- Multiple select element plus object -->
        <div for="categories" class="col form-group required">
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
      </div>
      <div class="row">
        <div class="col">
          <!-- Date input -->
          <label for="date">Date</label>
          <input
            id="date"
            v-model="date"
            class="form-control"
            v-bind:min="todayDate"
            name="date"
            type="datetime-local"
          />
        </div>
        <div class="col form-group">
          <label for="url">Url</label>
          <input
            id="url"
            v-model="url"
            class="form-control"
            maxlength="100"
            name="categories"
            placeholder="Url"
            type="text"
          />
        </div>
      </div>
      <div class="row">
        <div class="col form-group required">
          <label for="fee">Fee $</label>
          <input
            id="fee"
            v-model="fee"
            class="form-control"
            name="fee"
            placeholder="Fee $"
            type="number"
            step="0.01"
            min="0.0"
          />
        </div>
        <div class="col form-group required">
          <label for="capacity">Capacity</label>
          <input
            id="capacity"
            v-model="capacity"
            class="form-control"
            name="capacity"
            placeholder="Capacity"
            min="0"
            type="number"
          />
        </div>
      </div>
      <!-- Check boxes -->
      <div class="row mb-2 mt-3 align-items-center">
        <div class="col">
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Is online</label
          >
          <input
            v-model="isOnline"
            type="checkbox"
            class="form-check-input"
            id="onlineCheckBox"
          />
        </div>
        <div class="col">
          <label class="form-check-label mr-4" for="onlineCheckBox"
            >Requires attendance control</label
          >
          <input
            v-model="requiresAttendanceControl"
            type="checkbox"
            class="form-check-input"
            id="onlineCheckBox"
          />
        </div>
        <div class="col">
          <!-- Image uploading -->
          <label for="imageFile">Upload image</label>
          <input
            type="file"
            accept="image/*"
            @change="uploadImage($event)"
            id="file-input"
          />
        </div>
      </div>
      <div class="row mb-4">
        <div class="col">
          <label for="description">Description</label>
          <textarea
            required
            v-model="description"
            placeholder="Description"
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="3"
          ></textarea>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Create event
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
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
  },

  beforeMount() {
    this.setDateInputs();
    this.populateCategories();
  },

  methods: {
    /**
     * Set current date
     */
    setDateInputs() {
      // Set min date
      const today = new Date();
      let dd = today.getDate();
      let mm = today.getMonth() + 1;
      let yyyy = today.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      this.todayDate = yyyy + "-" + mm + "-" + dd + "T00:00";

      // Set default for date to 7 days from now
      let newDate = today;
      newDate.setDate(today.getDate() + 7);
      let newdd = newDate.getDate();
      let newmm = newDate.getMonth() + 1;
      let newyyyy = newDate.getFullYear();
      if (newdd < 10) {
        newdd = "0" + newdd;
      }
      if (newmm < 10) {
        newmm = "0" + newmm;
      }
      this.date = newyyyy + "-" + newmm + "-" + newdd + "T00:00";
    },

    /**
     * Calls the API and populates the list of categories based on the response
     */
    populateCategories() {
      this.axios.get(
        `http://localhost:4941/api/v1/events/categories`
      ).then((response) => {
        this.categoriesData = response.data;
      });
    },

    /**
     * Validate data and send POST to API
     */
    async createEvent() {
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
          this.$router.go();
          return;
        });

      // PUT event image
      if (this.image) {
        await this.postEventImage(eventId, this.image).catch((error) => {
          alert(error.response.statusText);
          this.$router.go();
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
      newEvent["date"] = this.date ? this.date : this.todayDate;
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
    async postEventImage(eventId, image) {
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
  },
};
</script>
