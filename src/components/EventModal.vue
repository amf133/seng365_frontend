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
                  {{ event == null ? "Undefined" : event.date }}
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
                  {{ event == null ? "Undefined" : event.venue == null ? "Online event" : event.venue }}
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
                  {{ event == null ? "Undefined" : event.attendeeCount }}
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
                    v-on:click="similarEvents()"
                  >
                    Similar events
                  </el-button>
                </el-button-group>
                <el-button-group class="ml-2" v-if="event && event.organizerId == userId">
                  <el-button
                    type="primary"
                    v-if="event && event.organizerId == userId"
                    v-on:click="editEvent()"
                  >
                    Edit event
                  </el-button>
                  <el-button
                    type="danger"
                    
                    v-on:click="deleteEvent()"
                  >
                    Delete event
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Second modal for attendees -->
    <div
      class="modal fade view_attendees"
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
                <h2>Attendees</h2>
              </div>
            </div>
            <div v-for="attendee in attendees" v-bind:key="attendee.attendeeId">
              <div class="row">
                <div class="col-4">
                  <p>
                    <strong>First name: {{ attendee.firstName }}</strong>
                  </p>
                </div>
                <div class="col-4">
                  <p>
                    <strong>Last name: {{ attendee.lastName }}</strong>
                  </p>
                </div>
                <div class="col-4">
                  <p>
                    <strong
                      >Role:
                      {{
                        attendee.attendeeId == event.organizerId
                          ? "Organizer"
                          : "Attendee"
                      }}</strong
                    >
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col">

                  <el-image
                  style="width: 100px; height: 100px"
                  :src="`http://localhost:4941/api/v1/users/${attendee.attendeeId}/image`"
                  fit="cover"
                  class="rounded-circle mb-2"
                  onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
                ></el-image>
                </div>
                <div class="col" v-if="event.organizerId == userId">
                  Status: {{ attendee.status }}
                </div>
                <div class="col" v-if="event.organizerId == userId">
                  <button
                    class="btn btn-outline-danger"
                    v-if="attendee.status == 'accepted'"
                    v-on:click="rejectAttendee(attendee)"
                  >
                    Reject
                  </button>
                  <button
                    class="btn btn-outline-success"
                    v-else
                    v-on:click="acceptAttendee(attendee)"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EventModal",
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
     * Accept an attendee to your event
     */
    async acceptAttendee(attendee) {
      let attendeeId = attendee.attendeeId;
      // Accept here
      await this.axios.patch(
        `http://localhost:4941/api/v1/events/${this.event.id}/attendees/${attendeeId}`,
        {
          status: "accepted",
        },
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
      this.$emit("updated", this.event.id);
    },

    /**
     * Reject an attendee from your event
     */
    async rejectAttendee(attendee) {
      let attendeeId = attendee.attendeeId;
      // Reject here
      await this.axios.patch(
        `http://localhost:4941/api/v1/events/${this.event.id}/attendees/${attendeeId}`,
        {
          status: "rejected",
        },
        {
          headers: {
            "X-Authorization": this.userToken,
          },
        }
      );
      this.$emit("updated", this.event.id);
    },

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
          alert(error.response.statusText);
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
          alert(error.response.statusText);
        });
      this.$emit("updated", this.event.id);
    },

    /**
     * Deletes an event
     */
    async deleteEvent() {
      await this.axios
        .delete(`http://localhost:4941/api/v1/events/${this.event.id}`, {
          headers: {
            "X-Authorization": this.userToken,
          },
        })
        .catch((error) => {
          alert(error.response.statusText);
        });
      this.$router.go();
    },

    /**
     * Populates the filter dropdown with events from the selected event
     */
    similarEvents() {
      alert("Not yet implemented!");
    },

    /**
     * Redirects admin to a page for editing their event
     */
    editEvent() {
      alert("Not yet implemented!");
    }
  },
};
</script>