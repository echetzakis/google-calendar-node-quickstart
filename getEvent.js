var google = require('googleapis');

function getEvent(auth, calendarId, eventId, callback){
 var calendar = google.calendar('v3');
  calendar.events.get({
    auth: auth,
    calendarId: calendarId || 'primary',
    eventId: eventId
  }, function(err, response) {
    if(err){
      callback(err, null);
    } else {
      attendees = response.attendees || []
      event = {
        title: response.summary,
        attendees: attendees
      }
      callback(null, event);
    }
  });
}

module.exports = getEvent