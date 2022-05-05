var todayCalArr = [],
today,
yesterday,
tomorrow,
indexes = [],
datePickedArr = [],
eventsWithNoLocationArePrivate = true,
allCalArr = [],
publicCalArr = [],
eventMapLinks = [],
writeAll,
updatedThisSession = false;

// I eventually want to grab the google calendar api data for today, and they format it in yy-mm-dd so this function helps setDates()
function convertDateFormat(date) {
  "use strict";
  var placeholder = date;
  // var placeholder = new Date(date);
  date = placeholder.getFullYear() + "-";

  if (placeholder.getMonth() + 1 < 10) {
    date = date + "0" + (placeholder.getMonth() + 1) + "-";
  } else {
    date = date + (placeholder.getMonth() + 1) + "-";
  }
  if (placeholder.getDate() < 10) {
    date = date + "0" + placeholder.getDate();
  } else {
    date = date + placeholder.getDate();
  }
  return date;
}

//Set yesterday, today, and tomorrow as dates
function setDates(datePicked) {
  "use strict";
  if (datePicked) {
    today = new Date(datePicked);
  } else {
    today = new Date();
  }

  yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  //Convert yesterday, today, and tomorrow in yy-mm-dd format
  yesterday = convertDateFormat(yesterday);
  today = convertDateFormat(today);
  tomorrow = convertDateFormat(tomorrow);


  getCalDataLocal();
}

// if it's stored in localStorage and last updated today get from localstorage, otherwise get from google calendars api
function getCalDataLocal() {
  "use strict";
  if (localStorage.storedallCalArr && updatedThisSession) {
    allCalArr = JSON.parse(localStorage.storedallCalArr);
    // console.log("Got Calendar Data from localStorage");
    setPublicCalArr();
    setUpcomingArray();
  } else {
    getCalDataApi();
  }
}

function getCalDataApi() {
  // console.log("Getting Calendar Data from Google Calendar API");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.allCalArr = xhttp.responseText;
      localStorage.setItem("storedallCalArr", allCalArr);
      console.log("Stored Map Data in localStorage");
      updatedThisSession = true;
      allCalArr = JSON.parse(allCalArr);
      setPublicCalArr();
      setUpcomingArray();
    }
  };
  xhttp.open(
    "GET",
    "/wp-content/plugins/map-google-calendar-appointments/cal-api-proxy.php",
    true
  );
  xhttp.send();
}

// parse out private events
function setPublicCalArr() {
  if (eventsWithNoLocationArePrivate) {
    publicCalArr = allCalArr.items.filter(function(element, index) {
      return element.location;
    });
  } else {
    publicCalArr = allCalArr.items;
  }
}

// loop through and pull todays events, but get at least 4 upcoming events even if they're in the future
function setUpcomingArray() {
  "use strict";
  for (var i = 0, atLeastFour = 0, atMostSix = 99999999, todayJSDate = new Date(today), firstSuccess = true; i < publicCalArr.length; i++) {
    var eventStartDate = Object.values(publicCalArr[i].start)[0].slice(0, 10);
    var eventJSDate = new Date(eventStartDate);
    var eventEndDate = Object.values(publicCalArr[i].start)[0].slice(0, 10);
    var status = Object.values(publicCalArr[i].start)[0].slice(0, 10);
    
    // ignore events in the past 
    if (todayJSDate > eventJSDate) {
      if (status == "cancelled") {
        // continue the loop an extra time if a cancelled event is found
        atLeastFour++;
      }
      continue;
    }
    
    // wherever i find a date match, atLeastFour is set on an OR statement to ensure it'll grab the next 4 events, even if they aren't today
    if (firstSuccess === true) {
      atLeastFour = Number(i + 4);
      atMostSix = Number(i + 6);
    }
    firstSuccess = false;
    
    try {
      if (i < atLeastFour && i < atMostSix) {

        todayCalArr.push([
          publicCalArr[i].summary,
          publicCalArr[i].location,
          [
            publicCalArr[i].start.dateTime, // 2022-05-04T15:30:00-06:00
            publicCalArr[i].start.dateTime.slice(0, 10), // 2022-05-31
            publicCalArr[i].start.dateTime.slice(11, 16), // 3:30 P.M.
            publicCalArr[i].start.dateTime.slice(5, 10) + "-" + publicCalArr[i].start.dateTime.slice(0, 4) // 05-31-2022
          ],
          [
            publicCalArr[i].end.dateTime, // 2022-05-04T15:30:00-06:00
            publicCalArr[i].end.dateTime.slice(0, 10), // 2022-05-31
            publicCalArr[i].end.dateTime.slice(11, 16), // 3:30 P.M.
            publicCalArr[i].end.dateTime.slice(5, 10) + "-" + publicCalArr[i].end.dateTime.slice(0, 4) // 05-31-2022
          ]
        ]);
      } else {
        break;
      }
    } catch (e) {
      console.log(e);
      publicCalArr[i].start = { dateTime: "No Date Was Listed" };

      // continue the loop an extra time if no date was found
      atLeastFour++;
    }
  }

  if (todayCalArr.length === 0) {
    document.getElementById("eventMapLinks")
    .innerHTML = `<h2>Oops, Something Went Wrong! Please Check the Monthly Calendar Below.</h2>`;
    return;
  }


  set12Hour();
}

function set12Hour() {
  for (var i = 0; i < todayCalArr.length; i++) {
    // Set times to 12 hour format including am or pm
    // start times
    if (Number(todayCalArr[i][2][2].slice(0, 2)) > 12) {
      todayCalArr[i][2][2] = Number(todayCalArr[i][2][2].slice(0, 2) - 12) + todayCalArr[i][2][2].slice(2, 5) + " P.M.";
    } else {
      todayCalArr[i][2][2] = todayCalArr[i][2][2] + " A.M.";
    }
    // end times
    if (Number(todayCalArr[i][3][2].slice(0, 2)) > 12) {
      todayCalArr[i][3][2] = Number(todayCalArr[i][3][2].slice(0, 2) - 12) + todayCalArr[i][3][2].slice(2, 5) + " P.M.";
    } else {
      todayCalArr[i][3][2] = todayCalArr[i][2][2] + " A.M.";
    }
  }


  getMapLinks();
}

function getMapLinks() {
  // console.log("Setting Map Links");
  var baseUrl = "https://maps.google.com/maps?q=";
  for (var i = 0; i < todayCalArr.length; i++) {
    todayCalArr[i].push(baseUrl + encodeURI(todayCalArr[i][1]));
  }


  writeEvents();
}

function writeEvents() {
  // console.log("Writing Map Links to visible page");
  // writeAll div contains all the HTML I want to write onto the screen
  writeAll = "";
  document.getElementById("eventMapLinks").innerHTML = "";
  var placeholder;
  for (var i = 0; i < todayCalArr.length; i++) {
    var placeholder =
    '<div class="eventInfoAndMap">' +
      '<h2>' +
        // add start date
        "" + todayCalArr[i][2][3] + "<br>" +
        
        // add day of week that event starts
        getDayFromDate(todayCalArr[i][2][1]) +
        todayCalArr[i][2][2] +
        " - <br>" +
        // add day of end
        getDayFromDate(todayCalArr[i][3][1]) +
        todayCalArr[i][3][2] +
        "&nbsp;&nbsp;&nbsp;" +
      "</h2>" +
      // description or title
      "<p>" + todayCalArr[i][0] + "<p>";

        // calendar doesn't always have a location/address set, so try catch here
        try {
          var address = todayCalArr[i][1].slice(0, -5); // erase ", USA"
          var addressSplit = address.split(',');
          
          placeholder += addressSplit[0] + "<br>";
          addressSplit.shift();
          placeholder += addressSplit.join(',').trim() + "<br>";
          
          placeholder += "<br>" +                
          // could enable the line below to get a link to google maps, but the map already has a "view larger map" link so I took it out
          // "<a href=\"" + todayCalArr[i][4] + "\">" + "Open In Google Maps</a></p>" +
            '<div class="mapouter"> ' +
              '<div class="gmap_cavas"> ' +
                '<iframe title="Map Of Upcoming Calendar Event" width="250" height="250" class="gmap_canvas_iframe" src="' +
                // finally figured out that '#' is what kept breaking the iframe request! They all work now!
                todayCalArr[i][4].replace(/#/gi, "") +
                '&t=&z=9&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">' +
                "</iframe>" +
              "</div>" +
            "</div>";
        } catch {
            placeholder += "<h4>Private Event</h4>";
        }
    placeholder += "</div>";
    // add to HTML div
    writeAll += placeholder;
  }
  document.getElementById("eventMapLinks").innerHTML = writeAll;


  setCalMinHeights();
}

function getDayFromDate(date) {
  var days = [
    "Sunday ",
    "Monday ",
    "Tuesday ",
    "Wednesday ",
    "Thursday ",
    "Friday ",
    "Saturday "
  ];
  var placeholder = new Date(convertDateFormatToSlash(date));
  return days[placeholder.getDay()];
}

function setCalMinHeights() {
  var minHeightP = 0,
    minHeightH2 = 0;

  for (var i = 0; i < document.querySelectorAll("#eventMapLinks p").length; i++) {
    if (document.querySelectorAll("#eventMapLinks p")[i].offsetHeight >minHeightP) {
      minHeightP = document.querySelectorAll("#eventMapLinks p")[i].offsetHeight;
    }
    if (document.querySelectorAll("#eventMapLinks h2")[i].offsetHeight >minHeightH2) {
      minHeightH2 = document.querySelectorAll("#eventMapLinks h2")[i].offsetHeight;
    }
  }

  for (var j = 0; j < document.querySelectorAll("#eventMapLinks p").length; j++) {
    document.querySelectorAll("#eventMapLinks p")[j].style.minHeight = minHeightP.toString() + "px";
    document.querySelectorAll("#eventMapLinks h2")[j].style.minHeight = minHeightH2.toString() + "px";
  }
  return "P minheights: " + minHeightP + " h2 minheight: " + minHeightH2;
}

function convertDateFormatToSlash(date) {
  "use strict";
  var dateToPass = date.split("");
  dateToPass[4] = dateToPass[7] = "/";
  dateToPass = dateToPass.join("");
  return dateToPass;
}

// when picking a day is enabled this gets called after clicking "get map for this day"
function dateSubmitted() {
  window.datePicked = document.getElementById("datePicker");
  dateToPass = convertDateFormatToSlash(datePicked.value);
  todayCalArr = [];


  setDates(dateToPass);
}

function inputSetToday() {
  document.getElementById("datePicker").value = convertDateFormat(
    new Date()
  );
}

window.addEventListener("load", function() {
  setDates();
  inputSetToday();

  document.getElementById("datePicker").addEventListener("change", function(e) {
    if (e.target.value !== today) {
      dateSubmitted();
    }
  });

});