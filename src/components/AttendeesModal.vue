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
          <el-row type="flex" justify="center">
              <h2>Attendees</h2>
          </el-row>
          <div v-for="attendee in attendees" v-bind:key="attendee.attendeeId">
            <el-row>
              <el-col :span="8">
                <p>
                  <strong>First name: {{ attendee.firstName }}</strong>
                </p>
              </el-col>
              <el-col :span="8">
                <p>
                  <strong>Last name: {{ attendee.lastName }}</strong>
                </p>
              </el-col>
              <el-col :span="8">
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
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-image
                  style="width: 100px; height: 100px"
                  :src="`http://localhost:4941/api/v1/users/${attendee.attendeeId}/image`"
                  fit="cover"
                  class="rounded-circle mb-2"
                  onerror="src='https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png'"
                ></el-image>
              </el-col>
              <el-col v-if="event.organizerId == userId">
                Status: {{ attendee.status }}
              </el-col>
              <el-col v-if="event.organizerId == userId">
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
              </el-col>
            </el-row>
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
      await this.axios.patch(
        `http://localhost:4941/api/v1/events/${this.event.id}/attendees/${attendee.attendeeId}`,
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
      await this.axios.patch(
        `http://localhost:4941/api/v1/events/${this.event.id}/attendees/${attendee.attendeeId}`,
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
