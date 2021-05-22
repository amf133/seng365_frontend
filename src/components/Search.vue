<template>
  <div class="container-fluid mt-4">
    <div class="row align-items-end mb-4">
      <!-- Filter by categories -->
      <div class="col text-center">
        <label class="mr-2">Filter categories</label>
        <el-select
          v-model="categories"
          multiple
          collapse-tags
          placeholder="Select"
          class="mr-4"
        >
          <el-option
            v-for="item in categoriesData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>

        <!-- Sorting -->
        <label class="mr-2">Sort by</label>
        <el-select v-model="sort" placeholder="Select">
          <el-option
            v-for="option in sortOptions"
            :key="option"
            v-bind:value="option"
            v-on:click="loadTable()"
          >
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="row mt-2">
      <div class="col text-center">
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
              v-for="event in eventsPage"
              v-bind:key="event.eventId"
            >
              <td>
                <!-- Image -->
                <el-image
                  style="width: 50px; height: 50px"
                  :src="
                    'http://localhost:4941/api/v1/events/' +
                    event.eventId +
                    '/image'
                  "
                  fit="cover"
                  class="rounded-circle"
                  onerror="src='https://www.kindpng.com/picc/m/421-4219807_news-events-icon-event-logo-png-transparent-png.png'"
                ></el-image>
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
        <el-pagination
          class="my-3"
          layout="prev, pager, next"
          v-model:currentPage="currentPage"
          :total="events.length"
          @current-change="changePage()"
          background
        >
        </el-pagination>
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
      @loadSimilarEvents="loadSimilarEvents"
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
      events: [],
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
      currentPage: 1,
      eventsPage: [],
    };
  },

  props: {
    userId: Number,
    userToken: String,
    queryString: String,
    myEvents: String,
  },

  mounted() {
    this.loadTable();
    this.populateCategories();
  },

  watch: {
    queryString: function () {
      this.loadTable();
    },
    categories: function () {
      this.loadTable();
    },
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
            organizerId: !this.myEvents ? null : this.userId,
          },
        })
        .then((response) => {
          this.events = response.data;
          this.eventsPage = this.events.slice(0, 10);
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

    /**
     * Handles when a pagination button is clicked
     */
    changePage() {
      this.eventsPage = this.events.slice(
        10 * (this.currentPage - 1),
        10 * this.currentPage
      );
    },

    /**
     * Adds given events to the filter query
     */
    loadSimilarEvents(categories) {
      this.categories = categories;
      this.loadTable();
    },
  },
};
</script>
