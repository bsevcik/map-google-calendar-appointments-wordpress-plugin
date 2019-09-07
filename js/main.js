/*eslint-env browser*/
var todayCalArr = [],
  today,
  yesterday,
  tomorrow,
  indexes = [],
  datePickedArr = [],
  allCalArr = [],
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
    console.log("date was picked successfully");
  } else {
    today = new Date();
  }
  yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  console.log(yesterday + "\n" + today + "\n" + tomorrow);

  //Convert yesterday, today, and tomorrow in yy-mm-dd format through convertDateFormat() helper function
  yesterday = convertDateFormat(yesterday);
  today = convertDateFormat(today);
  tomorrow = convertDateFormat(tomorrow);
  console.log(yesterday + "\n" + today + "\n" + tomorrow);

  getCalDataLocal();
}

// loop through and pull todays events, but get at least 4 upcoming events even if they're in the future
function setUpcomingArray() {
  "use strict";
  for (var i = 0, atLeastFour = 0; i < allCalArr.items.length; i++) {
    if (
      (allCalArr.items[i].start.dateTime.slice(0, 10) === today ||
        allCalArr.items[i].end.dateTime.slice(0, 10) === today ||
        (allCalArr.items[i].start.dateTime.slice(0, 10) === yesterday &&
          allCalArr.items[i].end.dateTime.slice(0, 10) === tomorrow) ||
        i < atLeastFour) &&
      allCalArr.items[i].status !== "cancelled"
    ) {
      if (atLeastFour === 0) {
        atLeastFour = Number(i + 4);
      }
      todayCalArr.push([
        allCalArr.items[i].summary,
        allCalArr.items[i].location,
        [
          allCalArr.items[i].start.dateTime,
          allCalArr.items[i].start.dateTime.slice(0, 10),
          allCalArr.items[i].start.dateTime.slice(11, 16)
        ],
        [
          allCalArr.items[i].start.dateTime,
          allCalArr.items[i].end.dateTime.slice(0, 10),
          allCalArr.items[i].end.dateTime.slice(11, 16)
        ]
      ]);
    }
  }
  set12Hour();
}

// if it's stored in localStorage and last updated today get from localstorage, otherwise get from google calendars api
function getCalDataLocal() {
  "use strict";
  if (localStorage.storedallCalArr && updatedThisSession) {
    allCalArr = JSON.parse(localStorage.storedallCalArr);
    console.log("Got Calendar Data from localStorage");
    setUpcomingArray();
  } else {
    getCalDataApi();
  }
}

function getCalDataApi() {
  console.log("Getting Calendar Data from Google Calendar API");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      window.allCalArr = xhttp.responseText;
      // allCalArr = allCalArr.slice(allCalArr.indexOf("{"));
      // allCalArr = allCalArr.slice(0, allCalArr.lastIndexOf(')'));
      localStorage.setItem("storedallCalArr", allCalArr);
      console.log("Stored Map Data in localStorage");
      updatedThisSession = true;
      allCalArr = JSON.parse(allCalArr);
      setUpcomingArray();
    }
  };
  // could add ability to use any google calendar link
  // var calLink = window.prompt("Type your calendar link");
  // xhttp.open("GET", calLink, true);
  var calApiBaseUrl0 =
    "https://www.googleapis.com/calendar/v3/calendars/macnnoodles.com_7fdgja52s47hprhro2il2sh7vg%40group.calendar.google.com/events?orderBy=startTime&cache=true&key=AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk&timeMin=" +
    today +
    "T00%3A00%3A00%2B00%3A00&timeMax=" +
    2019 -
    12 -
    31 +
    "T00%3A00%3A00%2B00%3A00&timeZone=America%2FDenver&singleEvents=true&maxResults=9999&false=America%2FDenver";
  xhttp.open(
    "GET",
    "https://www.googleapis.com/calendar/v3/calendars/macnnoodles.com_7fdgja52s47hprhro2il2sh7vg%40group.calendar.google.com/events?orderBy=startTime&cache=true&key=AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk&timeMin=2019-06-03T00%3A00%3A00%2B00%3A00&timeMax=2019-12-31T00%3A00%3A00%2B00%3A00&timeZone=America%2FDenver&singleEvents=true&maxResults=9999&false=America%2FDenver",
    true
  );
  xhttp.send();
}

function set12Hour() {
  for (var i = 0; i < todayCalArr.length; i++) {
    // Set times to 12 hour format including am or pm
    // start times
    if (Number(todayCalArr[i][2][2].slice(0, 2)) > 12) {
      todayCalArr[i][2][2] =
        Number(todayCalArr[i][2][2].slice(0, 2) - 12) +
        todayCalArr[i][2][2].slice(2, 5) +
        " P.M.";
    } else {
      todayCalArr[i][2][2] = todayCalArr[i][2][2] + " A.M.";
    }
    // end times
    if (Number(todayCalArr[i][3][2].slice(0, 2)) > 12) {
      todayCalArr[i][3][2] =
        Number(todayCalArr[i][3][2].slice(0, 2) - 12) +
        todayCalArr[i][3][2].slice(2, 5) +
        " P.M.";
    } else {
      todayCalArr[i][3][2] = todayCalArr[i][2][2] + " A.M.";
    }
  }
  getMapLinks();
}

function getMapLinks() {
  console.log("Setting Map Links");
  var baseUrl = "https://maps.google.com/maps?q=";
  for (var i = 0; i < todayCalArr.length; i++) {
    todayCalArr[i].push(baseUrl + encodeURI(todayCalArr[i][1]));
  }
  writeEvents();
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

function writeEvents() {
  console.log("Writing Map Links to visible page");
  // writeAll div contains all the HTML I want to write onto the screen
  writeAll = "";
  document.getElementById("eventMapLinks").innerHTML = "";
  var placeholder;

  // for (var i = 0; i < todayCalArr.length; i++) {
  //     var placeholder = "<div class=\"eventInfoAndMap\"><h2>" + todayCalArr[i][2].slice(11, 16) + " - " + todayCalArr[i][3].slice(11, 16) + "</h2>" +
  //     "<p>" + todayCalArr[i][0] + "<br>" +
  //     (todayCalArr[i][1].slice(0, -5)) + "<br>" +
  //     // "<a href=\"" + todayCalArr[i][4] + "\">" + "Open In Google Maps</a></p>" +
  //     "<div class=\"mapouter\"> " +
  //     "<div class=\"gmap_cavas\"> " +
  //     "<iframe width=\"250\" height=\"250\" id=\"gmap_canvas\" src=\"" + todayCalArr[i][4] +  "&t=&z=9&ie=UTF8&iwloc=&output=embed\" frameborder=\"0\" scrolling=\"no\" marginheight=\"0\" marginwidth=\"0\">" +
  //     "</iframe>" + "</div></div></div>";
  //     writeAll += placeholder;
  // }

  for (var i = 0; i < todayCalArr.length; i++) {
    var placeholder =
      '<div class="eventInfoAndMap"><h2>' +
      // add day of week that event starts
      getDayFromDate(todayCalArr[i][2][1]) +
      todayCalArr[i][2][2] +
      " - " +
      // add day of end
      getDayFromDate(todayCalArr[i][3][1]) +
      todayCalArr[i][3][2] +
      "</h2>" +
      // description or title
      "<p>" +
      todayCalArr[i][0] +
      "<br>";
    // calendar doesn't always have a location/address set, so try catch here
    try {
      placeholder +=
        todayCalArr[i][1].slice(0, -5) +
        "<br>" +
        // could enable the line below to get a link to google maps, but the map already has a "view larger map" link so I took it out
        // "<a href=\"" + todayCalArr[i][4] + "\">" + "Open In Google Maps</a></p>" +
        '<div class="mapouter"> ' +
        '<div class="gmap_cavas"> ' +
        '<iframe width="250" height="250" id="gmap_canvas" src="' +
        todayCalArr[i][4] +
        '&t=&z=9&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">' +
        "</iframe>" +
        "</div></div></div>";
    } catch {
      placeholder += "<p>Address Not Found</p></div>";
    }
    // add to HTML div
    writeAll += placeholder;
  }
  document.getElementById("eventMapLinks").innerHTML = writeAll;
  // <h2>11:00 - 1:30<br></h2>
  //     <p>
  //         <h3>Lockheed Martin Lunch</h3>
  //         Lockheed Martin Space, <br>
  //         12257 S Wadsworth Blvd, <br>
  //         Littleton, CO 80127, USA <br>
  //         <a href="https://maps.google.com/maps?q=Lockheed%20Martin%20Space,%2012257%20S%20Wadsworth%20Blvd,%20Littleton,%20CO%2080127,%20USA">Open In Google Maps</a>
  //       </p>
  //   </div>
  //   <div class="mapouter">
  //       <div class="gmap_canvas">
  //           <iframe width="250" height="250" id="gmap_canvas" src="https://maps.google.com/maps?q=Lockheed%20Martin%20Space%2C%20%2012257%20S%20Wadsworth%20Blvd%2C%20%20Littleton%2C%20CO%2080127%2C%20USA&t=&z=9&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
  //           </iframe>
  //       </div>
}

// src="https://maps.google.com/maps?q=
// university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed"

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
  console.log(datePicked.value);
  todayCalArr = [];
  setDates(dateToPass);
}

function inputSetToday() {
  document.getElementById("datePicker").value = convertDateFormat(new Date());
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

// var x = allCalArr.items[0].start.dateTime;
// var y = new Date(x).toLocaleString("en-US", {timeZone: "America/Denver"});
// var data = $.get('https://www.googleapis.com/calendar/v3/calendars/macnnoodles.com_7fdgja52s47hprhro2il2sh7vg%40group.calendar.google.com/events?callback=jQuery21400583278904774025_1554850837976&orderBy=startTime&cache=true&key=AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk&timeMin=2019-03-30T00%3A00%3A00%2B00%3A00&timeMax=2019-05-13T00%3A00%3A00%2B00%3A00&timeZone=America%2FDenver&singleEvents=true&maxResults=9999&false=America%2FDenver');

// google calendar api-key: AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk
// account details: "macnnoodles.com_7fdgja52s47hprhro2il2sh7vg@group.calendar.google.com"
// https://www.googleapis.com/calendar/v3/calendars/macnnoodles.com_7fdgja52s47hprhro2il2sh7vg%40group.calendar.google.com/events?cache=true&key=AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk&maxResults=9999
// https://www.googleapis.com/calendar/v3/calendars/macnnoodles.com_7fdgja52s47hprhro2il2sh7vg%40group.calendar.google.com/events?callback=jQuery21400583278904774025_1554850837976&orderBy=startTime&cache=true&key=AIzaSyC-KzxSLmmZitsCVv2DeueeUxoVwP0raVk&timeMin=2019-03-30T00%3A00%3A00%2B00%3A00&timeMax=2019-05-13T00%3A00%3A00%2B00%3A00&timeZone=America%2FDenver&singleEvents=true&maxResults=9999&false=America%2FDenver
// appID: "129acb44-2c8a-8314-fbc8-73d5b973a88f"
// a sample shows April 10 2019 at 8:00 pm, which is offset from UTC by -6:00 for Mountain Daylight savings time. MST is -07:00 "dateTime": "2019-04-10T20:00:00-06:00"

//It appears that google wants me to use an api key, but it would be free anyways. If they cut me off then oh well...
//https://developers.google.com/maps/documentation/embed/usage-and-billing
/* <iframe
  width="600"
  height="450"
  frameborder="0" style="border:0"
  src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY
    &q=Space+Needle,Seattle+WA" allowfullscreen>
</iframe> */
