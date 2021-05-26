<template>
  <div>
    <!-- First modal for event -->
    <div
      class="modal fade view_event"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="container">
            <div class="row text-center mb-2">
              <div class="col">
                <h2>{{ event == null ? "Undefined" : event.title }}</h2>
                <img
                  id="image"
                  :src="eventImageUrl"
                  class="rounded"
                  alt="EventImage"
                  width="600"
                  onerror="src='https://www.kindpng.com/picc/m/421-4219807_news-events-icon-event-logo-png-transparent-png.png'"
                />
              </div>
            </div>

            <div class="row">
              <div class="col">
                <p>
                  <strong>Date:</strong>
                  {{
                    event == null
                      ? "Undefined"
                      : new Date(event.date).toDateString()
                  }}
                </p>
              </div>
              <div class="col">
                <p>
                  <strong>Fee:</strong> ${{
                    event == null ? "Undefined" : event.fee
                  }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <p>
                  <strong>Venue:</strong>
                  {{
                    event == null
                      ? "Undefined"
                      : event.venue == null
                      ? "Online event"
                      : event.venue
                  }}
                </p>
              </div>
              <div class="col">
                <p>
                  <strong>URL:</strong>
                  {{ event == null || event.url == null ? "N/A" : event.url }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <p>
                  <strong>Number of attendees: </strong>
                  {{ event == null ? "Undefined" : event.attendeeCount || 0 }}
                </p>
              </div>
              <div class="col">
                <p>
                  <strong>Capacity:</strong>
                  {{ event == null ? "Undefined" : event.capacity }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-4">
                <p>
                  <strong>Host:</strong>
                  {{
                    event == null
                      ? "Undefined"
                      : event.organizerFirstName + " " + event.organizerLastName
                  }}
                </p>
                <el-image
                  style="width: 100px; height: 100px"
                  :src="adminImageUrl"
                  fit="cover"
                  class="rounded-circle mb-2"
                  onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
                ></el-image>
              </div>
              <div class="col-8">
                <p class="text-break">
                  <strong>Description:</strong>
                  {{ event == null ? "Undefined" : event.description }}
                </p>
              </div>
            </div>
            <div class="row align-items-center">
              <div class="col-4">
                <p>
                  <strong>Attending status:</strong>
                  {{ me ? me.status : "not attending" }}
                </p>
              </div>
              <div class="col-8">
                <p>
                  <strong>Categories:</strong>
                  {{ event == null ? "Undefined" : event.categories }}
                </p>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col text-center">
                <el-button-group>
                  <el-button
                    v-if="
                      me && (me.status == 'accepted' || me.status == 'pending')
                    "
                    v-on:click="leaveEvent()"
                    type="danger"
                  >
                    Leave event
                  </el-button>
                  <el-button
                    v-if="!me"
                    v-on:click="attendEvent()"
                    type="success"
                  >
                    Attend event
                  </el-button>
                  <el-button
                    type="info"
                    data-toggle="modal"
                    data-target=".view_attendees"
                  >
                    View attendees
                  </el-button>
                  <el-button
                    type="warning"
                    data-dismiss="modal"
                    v-on:click="similarEvents()"
                  >
                    Similar events
                  </el-button>
                </el-button-group>
                <el-button-group
                  class="ml-2"
                  v-if="event && event.organizerId == userId"
                >
                  <el-button
                    type="primary"
                    data-dismiss="modal"
                    v-if="event && event.organizerId == userId"
                    v-on:click="editEvent()"
                  >
                    Edit event
                  </el-button>
                  <!-- Delete button with confirm popup -->
                  <el-popconfirm
                    confirmButtonText="OK"
                    cancelButtonText="Cancel"
                    icon="el-icon-info"
                    iconColor="red"
                    title="Are you sure to delete this?"
                    @confirm="deleteEvent()"
                  >
                    <template #reference>
                      <el-button type="danger"> Delete event </el-button>
                    </template>
                  </el-popconfirm>
                </el-button-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <attendees-modal
      :attendees="attendees"
      :event="event"
      :userId="userId"
      :userToken="userToken"
      @updated="$emit('updated', $event)"
    ></attendees-modal>
  </div>
</template>

<script>
import AttendeesModal from "./AttendeesModal";

export default {
  components: { AttendeesModal },
  name: "EventModal",
  Components: [AttendeesModal],
  props: {
    event: null,
    eventImageUrl: null,
    adminImageUrl: null,
    attendees: null,
    userToken: null,
    userId: null,
    me: null,
  },
  methods: {
    /**
     * Request attendance to event
     */
    async attendEvent() {
      await this.axios
        .post(
          `http://localhost:4941/api/v1/events/${this.event.id}/attendees`,
          {},
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
        });
      this.$emit("updated", this.event.id);
    },

    /**
     * Revoke attendance for event
     */
    async leaveEvent() {
      await this.axios
        .delete(
          `http://localhost:4941/api/v1/events/${this.event.id}/attendees`,
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
        });
      this.$emit("updated", this.event.id);
    },

    /**
     * Deletes an event
     */
    async deleteEvent() {
      if (new Date(this.event.date) < new Date()) {
        this.$notify.warning({
              title: "Error",
              message: "Cannot delete events that have already taken place!",
            });
        return;
      }

      await this.axios
        .delete(`http://localhost:4941/api/v1/events/${this.event.id}`, {
          headers: {
            "X-Authorization": this.userToken,
          },
        })
        .catch((error) => {
          this.$notify.error({
            title: "Error",
            message: error.response.statusText,
          });
        });
      this.$router.go();
    },

    /**
     * Populates the filter dropdown with events from the selected event
     */
    similarEvents() {
      this.$emit("loadSimilarEvents", this.event.categories);
    },

    /**
     * Redirects admin to a page for editing their event
     */
    editEvent() {
      let args = {
        name: "createEvent",
        params: {
          eventId: this.event.id,
        },
      };
      this.$router.push(args);
    },
  },
};
</script>