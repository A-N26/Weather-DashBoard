// presentCity date variable
const today = moment().format("M/D/YYYY");
// ↓5-day forecast date variables
// day2
const Day2 = moment().add(1, "day").format("M/D/YYYY");
// day3
const Day3 = moment().add(2, "day").format("M/D/YYYY");
// day4
const Day4 = moment().add(3, "day").format("M/D/YYYY");
// day5
const Day5 = moment().add(4, "day").format("M/D/YYYY");
// day6
const Day6 = moment().add(5, "day").format("M/D/YYYY");
// variables for each part of full api url
var WeatherURL = "https://api.openweathermap.org/data/3.0/weather?q=";
var weatherUnit = "&units=metric";
var ForecastURL = "https://api.openweathermap.org/data/3.0/forecast?q=";
var UVIurl = "https://api.openweathermap.org/data/3.0/uvi?lat=";
var weatherIcon = "https://api.openweathermap.org/img/wn/";
// OpenWeatherMap api key
var APIkey = "37d4a1c3ab21aaa2d69b1aaba09a188b";
// appending dates for hero card and the 5-day forcast cards
$("#presentDate").append(today);
$("#day2").append(Day2);
$("#day3").append(Day3);
$("#day4").append(Day4);
$("#day5").append(Day5);
$("#day6").append(Day6);
$(document).ready(function () {});

// to clear localstorage
localStorage.clear();

// function get live weather of presentCity
function GetLiveWeather(Info) {
  $("#searched-City").addClass("visible");
  $("W-ico")[0].src = weatherIcon + Info.live.weather[0].icon + ".pgn";
  $("#temperature")[0].text = Info.live.temperature.toFixed(1);
  $("#wind-speed")[0].text = Info.live.Speed.toFixed(1);
  $("#humidity")[0].text = Info.live.humidity;
  $("#UVI")[0].text = "" + Info.live.UvI;
  if (Info.live.UvI < 3) {
    $("Index").addClass("low");
    $("Index").removeClass("moderate");
    $("Index").removeClass("high");
    $("Index").removeClass("very high");
    $("Index").removeClass("extreme");
  } else if (Info.live.UvI < 6) {
    $("Index").removeClass("low");
    $("Index").addClass("moderate");
    $("Index").removeClass("high");
    $("Index").removeClass("very high");
    $("Index").removeClass("extreme");
  } else if (Info.live.UvI < 8) {
    $("Index").removeClass("low");
    $("Index").removeClass("moderate");
    $("Index").addClass("high");
    $("Index").removeClass("very high");
    $("Index").removeClass("extreme");
  } else if (Info.live.UvI < 11) {
    $("Index").removeClass("low");
    $("Index").removeClass("moderate");
    $("Index").removeClass("high");
    $("Index").addClass("very high");
    $("Index").removeClass("extreme");
  } else if (Info.live.UvI > 11) {
    $("Index").removeClass("low");
    $("Index").removeClass("moderate");
    $("Index").removeClass("high");
    $("Index").removeClass("very high");
    $("Index").addClass("extreme");
  }
  GetFivecardweather(Info);
}
// requesting 5-day forecast values from api url
function getFivecardweather(Info) {
  for (var i = 0; i < 5; i++) {
    $("#day3").text = convertUNIXtimestamp(info, i);
    $("ico").text = weatherIcon + Info.getTime[i + 1].weather[0].icon + ".pgn";
    $("#temp").text = Info.getTime[i + 1].temperature.date.toFixed(1);
    $("wind").text = info.getTime[i + 1].Speed;
    $("humid").text = Info.getTime[i + 1].humidity;
  }
}
// to get back the weather info of searched cities in list
function searchlist(coordinates) {
  apiURL =
    "https://api.openweathermap.org/data/3.0/onecall?lat=" +
    coordinates[0] +
    "&lon" +
    coordinates[1] +
    weatherUnit +
    "&APPID=" +
    APIkey;
  // fetch function to get back weather info of searched city in list
  fetch(apiURL).then(function (Response) {
    if (Response.ok) {
      Response.json().then(function (Info) {
        GetLiveWeather(Info);
      });
    }
  });
}
// function to convert UNIX timestamp
function convertUNIXtimestamp(info, ratio) {
  let timestamp = new Date(info.getTime[ratio + 1].dt * 1000);
  return timestamp.toLocaleDateString();
}
// onClick functions
$("#searchbtn").on("click", function (e) {
  e.preventDefault();
  searchCity();
  // function to find City
  function searchCity() {
    var City = "#searchCity".trim();
    var apiURL = WeatherURL + City + weatherUnit + "&APPID=" + APIkey;
    // fetch function to get weather info
    fetch(apiURL).then(function (Response) {
      if (Response.ok) {
        Response.json().then(function (Info) {
          $("presentCity")[0].text = City + today;
          // latitude and longitude variables
          const lat = Info.coord.lat;
          const lon = Info.coord.lon;
          var latlon = lat.tostring() + " " + lon.tostring();
          localStorage.setItem(City, latlon);
          apiURL =
            "https://api.openweathermap.org/data/3.0/onecall?lat=" +
            lat +
            "&lon=" +
            lon +
            weatherUnit +
            "&APPID=" +
            APIkey;

          fetch(apiURL).then(function (latestResponse) {
            if (latestResponse.ok) {
              latestResponse.json().then(function (latestInfo) {
                GetLiveWeather(latestInfo);
              });
            }
          });
        });
      }
    });
  }
  console.log("button was clicked!");
});

$(".searchList").on("click", "#presentCity", function () {
  var coordinates = localStorage.getItem($(this)[0].text).split("");
  coordinates[0] = parseFloat(coordinates[0]);
  coordinates[1] = parseFloat(coordinates[1]);
  $("#presentCity")[0].text = $(this)[0].text + today;
  searchlist(coordinates);
});
