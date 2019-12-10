
class Departure {
  constructor(eta) {
    this.eta = new Date(eta)
    this.arrival = (new Date(eta)).getMinutes() - (new Date().getMinutes())
  }
}
//Return the closest departure
function min_departure(route, name, routeId) {
  all_deps = []
  for (let departure of route.Departures) {
    dep = new Departure(departure.ETALocalTime)
    all_deps.push(dep)
  }
  min = all_deps[0].arrival
  for (let dep of all_deps) {
    if (dep.arrival < min) {
      min = dep
    }
  }
  return min
}

// returns the result of subracting time t2 from time t1. Returns -1 if t2 is 
// after t1
function subtract_time(t1, t2) {
  if (t1.getHours() == t2.getHours()) {
    return (t1.getMinutes() - t2.getMinutes())
  }
  else if (t1.getHours() > t2.getHours()) {
    return 60 * (t1.getHours() - t2.getHours()) + t1.getMinutes() - t2.getMinutes()
  }
  else return -1

}

// In this file I'm going to get bus arrival data from the TCAT API and display it
// on an html page

// render data into html
// msg is JSON data from API
function render(msg) {
  departures = []
  for (let route of msg[0].RouteDirections) {
    
      for (let departure of route.Departures) {
        eta = new Date(departure.ETALocalTime)
        arrival = subtract_time(eta, (new Date)) // current time minus arrival
        console.log(arrival)
        name = departure.Trip.InternalSignDesc
        routeId = route.RouteId
        departures.push({ arrival: arrival, name: name, routeId: routeId })
      
    }
  }
  sortedDepartures = departures.sort(function (a, b) { return a.arrival - b.arrival; })
  unique_deps = []
  map = new Map()
  for (let dep of sortedDepartures) {
    if (!map.has(dep.routeId)) {
      map.set(dep.routeId, dep.arrival)
      unique_deps.push(dep)
    } else {
      if (map.get(dep.RouteId) != dep.arrival) {
        unique_deps.push(dep)
      }
    }
  }
  for (let dep of unique_deps) {
    if (dep.arrival > 0) {
      $('#time_info').append("<div class='time_info_sub'><p>" + dep.arrival + " min</p></div>");
      $("#serv_info").append("<div class='serv_info_sub'><p>" + dep.routeId + "</p></div>");
      $('#dest_info').append('<div class="dest_info_sub"><h5>' + dep.name + ' </h5></div>');
    }
  }
}

// make the tab that displays the next stops work


//On TCAT API, loop through the stops to see if the bus stops at that Stop
// If the bus does, add it to an array called Stops[]
// Sort the array of stops by StopSeq and print it
// for (let stop of msg){
//   var stop = msg.StopId;
// }



function renderDate() {
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var date = new Date();
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  var hour = date.getHours();
  var month = months[date.getMonth()];
  var year = date.getFullYear();
  var day = date.getDate();
  var ampm = hour >= 12 ? "PM" : "AM";
  hour = (hour % 12) ? (hour % 12) : 12;
  $('#date').html("<h3>" + month + " " + day + " " + year + "</h3>" + "<h3>" + hour + ":" + minutes + " " + ampm + "</h3>");

  setTimeout(renderDate, 1000);
}



function renderTimetable() {
  // header auth token from TCAT
  var token = 'Bearer e5159b89-86c1-3cca-8412-59de037c674b';
  var currStop = 1351;
  $.ajax({
    url: 'https://gateway.api.cloud.wso2.com:443/t/mystop/tcat/v1/rest/StopDepartures/Get/' + currStop,
    type: 'GET',
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", token);
    },
    success: render
  });


  renderDate();
  renderStops();
  renderRoute();
}



// when the document is loaded render the timetable

setTimeout($(document).ready(renderTimetable), 10)


function renderStops(currStop) {
  var token = 'Bearer e5159b89-86c1-3cca-8412-59de037c674b';
  $.ajax({
    url: "https://gateway.api.cloud.wso2.com:443/t/mystop/tcat/v1/rest/Stops/GetAllStops",
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", token);
    },
    success: render2
  });
}


function render2(msg) {
  var currStop = 1351;
  for (let stop of msg) {
    if (stop.StopId == currStop) {
      var name = stop.Description;
      $('#title').html("<h1>" + name + "</h1>");
    }
  }
}

function renderRoute() {
  var token = 'Bearer e5159b89-86c1-3cca-8412-59de037c674b';
  $.ajax({
    url: "https://gateway.api.cloud.wso2.com:443/t/mystop/tcat/v1/rest/Stops/GetAllStops",
    dataType: 'json',
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", token);
    },
    success: render3
  });
}


function render3(msg) {
  console.log("testing");
  /*
  var nextBus = sortedDepartures[0].routeId;
  var currentStop = msg[0].StopID;
  var nextBusDirection = sortedDepartures[0].name;
*/
}
