<template>
  <div class="container-fluid mt-2">
    <el-row type="flex" justify="center" align="middle" class="mb-2">
      <!-- Filtering -->
      <label class="mr-2">Filter by</label>
      <el-select
        v-model="categories"
        multiple
        collapse-tags
        placeholder="Select categories"
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
      <el-select v-model="sort" placeholder="Select sort option">
        <el-option
          v-for="option in sortOptions"
          :key="option"
          v-bind:value="option"
          v-on:click="loadTable()"
        >
        </el-option>
      </el-select>
    </el-row >
    <el-row type="flex" justify="center" class="text-center">
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
            class="event"
            data-toggle="modal"
            data-target=".view_event"
            v-for="event in eventsPage"
            v-bind:key="event.eventId"
          >
            <td>
              <!-- Image -->
              <el-image
                style="width: 40px; height: 40px"
                :src="
                  'http://152.67.97.30:4941/api/v1/events/' +
                  event.eventId +
                  '/image'
                "
                fit="cover"
                class="rounded-circle"
                onerror="src='https://www.kindpng.com/picc/m/421-4219807_news-events-icon-event-logo-png-transparent-png.png'"
              ></el-image>
            </td>
            <td>{{ new Date(event.date).toDateString() }}</td>
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
        class="mb-2"
        layout="prev, pager, next"
        v-model:currentPage="currentPage"
        :total="events.length"
        @current-change="changePage()"
        background
      >
      </el-pagination>
    </el-row>
    <!-- Custom event modal -->
    <event-modal
      :userId="userId"
      :userToken="userToken"
      :event="event"
      @updated="setEvent"
      @loadSimilarEvents="loadSimilarEvents"
    ></event-modal>
  </div>
</template>

<style scoped>
.event:hover {
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
      sort: null,
      sortOptions: ["ATTENDEES_ASC", "ATTENDEES_DESC", "DATE_ASC", "DATE_DESC"],
      categoriesData: null,
      currentPage: 1,
      eventsPage: [],
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
        .get(`/events/`, {
          params: {
            q: this.queryString,
            categoryIds: this.categories,
            sortBy: this.sort,
            organizerId:
              this.$route.name == "searchMyEvents" ? this.userId : null,
          },
        })
        .then((response) => {
          this.events = response.data;
          this.eventsPage = this.events.slice(0, 10);
        })
        .catch((error) => {
          this.$router.push({ name: "home" });
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
    },

    /**
     * Calls the API and populates the list of categories based on the response
     */
    populateCategories() {
      this.axios
        .get(`/events/categories`)
        .then((response) => {
          this.categoriesData = response.data;
        });
    },

    /**
     * Sets the event var to be used in the modal popup
     */
    async setEvent(eventId) {
      // Call get full details about selected event
      await await this.axios
        .get(`/events/` + eventId)
        .then((response) => {
          this.event = response.data;
        })
        .catch((error) => {
          this.$router.push({ name: "home" });
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
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
     * Adds given categories to the filter
     */
    loadSimilarEvents(categories) {
      // Allows other events to be viewed
      if (this.$route.name == "searchMyEvents") {
        this.$route.name = "searchEmpty";
      }
      this.categories = categories;
      this.loadTable();
    },
  },
};
</script>
