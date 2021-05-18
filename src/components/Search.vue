<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col">
        <h1 class="text-center">Event Search</h1>
      </div>
    </div>
    <div class="row align-items-end mb-4">
      <!-- Filter by categories -->
      <div class="col-2">
        <el-row>
          <label class="mr-2">Categories</label>
        </el-row>
        <el-select
          id="categoriesD"
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
            @click="loadTable()"
            :clearable="false"
          >
          </el-option>
        </el-select>
      </div>
      <!-- Sorting -->
      <div class="col-2">
        <label for="sortDropdown">Sort by:</label>
        <select
          required
          class="form-control"
          id="sortDropdown"
          v-model="sort"
          v-on:click="loadTable()"
        >
          <option
            v-for="option in sortOptions"
            :key="option"
            v-bind:value="option"
          >
            {{ option }}
          </option>
        </select>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col">
        <!-- Table for event data -->
        <table class="table">
          <thead>
            <!-- Header row -->
            <tr>
              <th>Image</th>
              <th>Date</th>
              <th>Title</th>
              <th>Categories</th>
              <th>Host</th>
              <th>Attendees</th>
            </tr>
            <!-- Data rows -->
            <tr
              v-on:click="setEvent(event.eventId)"
              class="grow"
              data-toggle="modal"
              data-target=".view_event"
              v-for="event in events"
              v-bind:key="event.eventId"
            >
              <td>
                <img
                  id="image"
                  :src="
                    'http://localhost:4941/api/v1/events/' +
                    event.eventId +
                    '/image'
                  "
                  alt="eventImage"
                  width="50"
                  class="mb-2"
                  onerror="src='https://www.kindpng.com/picc/m/421-4219807_news-events-icon-event-logo-png-transparent-png.png'"
                />
              </td>
              <td>{{ event.date }}</td>
              <td>{{ event.title }}</td>
              <td>{{ event.categories }}</td>
              <td>
                {{ event.organizerFirstName + " " + event.organizerLastName }}
              </td>
              <td>{{ event.numAcceptedAttendees }}</td>
            </tr>
          </thead>
        </table>
      </div>
    </div>
    <!-- Custom event modal -->
    <event-modal
      :me="me"
      :userId="userId"
      :userToken="userToken"
      :event="event"
      :eventImageUrl="eventImageUrl"
      :adminImageUrl="adminImageUrl"
      :attendees="attendees"
      @updated="setEvent"
    ></event-modal>
  </div>
</template>

<style scoped>
.grow:hover {
  background-color: lightgray;
  cursor: pointer;
}
</style>

<script>
import EventModal from "./EventModal.vue";

export default {
  name: "Search",

  components: {
    EventModal,
  },

  data() {
    return {
      events: null,
      event: null,
      categories: [],
      category: null,
      sort: null,
      sortOptions: ["ATTENDEES_ASC", "ATTENDEES_DESC", "DATE_ASC", "DATE_DESC"],
      eventImageUrl: `http://localhost:4941/api/v1/events/1/image`,
      adminImageUrl: `http://localhost:4941/api/v1/users/1/image`,
      attendees: [],
      me: null,
      categoriesData: null,
    };
  },

  props: {
    userId: Number,
    userToken: String,
    queryString: String,
  },

  mounted() {
    this.loadTable();
    this.populateCategories();
  },

  methods: {
    /**
     * Loads the events table
     */
    async loadTable() {
      await this.axios
        .get(`http://localhost:4941/api/v1/events/`, {
          params: {
            q: this.queryString,
            categoryIds: this.categories,
            sortBy: this.sort,
          },
        })
        .then((response) => {
          this.events = response.data;
        })
        .catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });
    },

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
     * Sets the event var to be used in the modal popup
     */
    async setEvent(eventId) {
      // Call API for full details about single event
      await this.getEvent(eventId)
        .then((response) => {
          this.event = response.data;
        })
        .catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });

      // Call API for full details about admins for the selected event
      await this.getAttendees(eventId)
        .then((response) => {
          this.attendees = response.data;
        })
        .catch((error) => {
          alert(error.response.statusText);
          this.$router.push({ name: "home" });
          return;
        });

      // Add ids to list
      this.me = null;
      this.attendees.forEach((attendee) => {
        if (attendee.attendeeId == this.userId) {
          this.me = attendee;
        }
      });

      this.eventImageUrl = `http://localhost:4941/api/v1/events/${this.event.id}/image`;
      this.adminImageUrl = `http://localhost:4941/api/v1/users/${this.event.organizerId}/image`;
    },

    /**
     * Retreive details about one event
     */
    async getEvent(eventId) {
      let response = await this.axios.get(
        `http://localhost:4941/api/v1/events/` + eventId
      );
      return response;
    },

    /**
     * Retreive a list of attendees from a event
     */
    async getAttendees(eventId) {
      // /events/{id}/attendees
      let response = await this.axios.get(
        `http://localhost:4941/api/v1/events/${eventId}/attendees`,
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
      return response;
    },
  },
};
</script>
