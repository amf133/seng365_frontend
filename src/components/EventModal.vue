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
                />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <p>
                  <strong>Description:</strong>
                  {{ event == null ? "Undefined" : event.description }}
                </p>
                <p>
                  <strong>Date:</strong>
                  {{ event == null ? "Undefined" : event.date }}
                </p>
                <p>
                  <strong>Host:</strong>
                  {{
                    event == null
                      ? "Undefined"
                      : event.organizerFirstName + " " + event.organizerLastName
                  }}
                </p>
                <img
                  id="image"
                  :src="adminImageUrl"
                  alt="AdminImage"
                  width="200"
                  class="mb-2"
                  onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
                />
                <p>
                  <strong>Categories:</strong>
                  {{ event == null ? "Undefined" : event.categories }}
                </p>
                <p>
                  <strong>Capacity:</strong>
                  {{ event == null ? "Undefined" : event.capacity }}
                </p>
                <p>
                  <strong>Attendees:</strong>
                  {{ event == null ? "Undefined" : event.attendeeCount }}
                </p>
              </div>
            </div>
            <div class="row">
              <div class="col-3">
                <p><strong>List of attendees:</strong></p>
              </div>
              <div class="col-9">
                <button
                  class="btn btn-outline-dark"
                  data-toggle="modal"
                  data-target=".view_attendees"
                >
                  View
                </button>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <p>
                  <strong>URL:</strong>
                  {{ event == null || event.url == null ? "N/A" : event.url }}
                </p>
                <p>
                  <strong>Venue:</strong>
                  {{ event == null ? "Undefined" : event.venue }}
                </p>
                <p>
                  <strong>Fee:</strong> ${{
                    event == null ? "Undefined" : event.fee
                  }}
                </p>
              </div>
            </div>
            <div class="row mb-2">
              <div class="col">
                <p>
                  <strong>Attending status:</strong>
                  {{ me ? me.status : "not attending" }}
                </p>
              </div>
              <div class="col">
                <button
                  v-if="
                    me && (me.status == 'accepted' || me.status == 'pending')
                  "
                  class="btn btn-outline-danger"
                  v-on:click="leaveEvent()"
                >
                  Leave event
                </button>
                <button
                  v-if="!me"
                  class="btn btn-outline-success"
                  v-on:click="attendEvent()"
                >
                  Attend event
                </button>
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
                  <img
                    id="image"
                    :src="`http://localhost:4941/api/v1/users/${attendee.attendeeId}/image`"
                    alt="AdminImage"
                    width="200"
                    class="mb-2"
                    onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
                  />
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
          alert(error.response.statusText)
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
          alert(error.response.statusText)
        });
      this.$emit("updated", this.event.id);
    },
  },
};
</script>
