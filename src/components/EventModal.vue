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
                  width="500"
                  class="mb-2"
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
                <!-- Need to call new modal here -->
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
                    <strong>Role: {{ attendee.attendeeId == event.organizerId ? "Organizer" : "Attendee" }}</strong>
                  </p>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <img
                    id="image"
                    :src="`http://localhost:4941/api/v1/users/${attendee.attendeeId}/image`"
                    alt="AdminImage"
                    width="500"
                    class="mb-2"
                  />
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
  },
};
</script>
