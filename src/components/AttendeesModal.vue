<template>
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
</template>

<script>
export default {
  name: "AttendeesModal",
  props: {
    event: null,
    attendees: null,
    userToken: null,
    userId: null,
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
  },
};
</script>
