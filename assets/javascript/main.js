
// Initialize Firebase
var config = {
  apiKey: "AIzaSyB3qWy3kAjXkye5Ub2oXiH5ZJWZlpP0VKI",
  authDomain: "trainscheduler-4eb7e.firebaseapp.com",
  databaseURL: "https://trainscheduler-4eb7e.firebaseio.com",
  projectId: "trainscheduler-4eb7e",
  storageBucket: "trainscheduler-4eb7e.appspot.com",
  messagingSenderId: "117899904334"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainNameInput = $("#train-name-input").val().trim();
  var desinationInput = $("#desination-input").val().trim();
  var timeInput = $("#time-input").val().trim();// var timeInput = moment($("#time-input").val().trim(), "HH:mm").format("X");
  var frequencyInput = $("#freq-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainNameInput,
    desination: desinationInput,
    startTime: timeInput,
    frequency: frequencyInput
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log('newTrain', newTrain);

  // Alert
  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#desination-input").val("");
  $("#time-input").val("");
  $("#freq-input").val("");
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {

  console.log("childSnapshot.val()", childSnapshot.val());

  // Store everything into a variable.
  var trainNameInFirebase = childSnapshot.val().trainName;
  var desinationInFirebase = childSnapshot.val().desination;
  var startingTimeInFirebase = childSnapshot.val().startTime;
  var frequencyInFirebase = childSnapshot.val().frequency;

  // train Info
  console.log("-------------------------------Train Info-------------------------")
  console.log("trainNameInFirebase", trainNameInFirebase);
  console.log("desinationInFirebase", desinationInFirebase);
  console.log("startingTimeInFirebase", startingTimeInFirebase);
  console.log("frequencyInFirebase", frequencyInFirebase);


  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(startingTimeInFirebase, "HH:mm").subtract(1, "days");
  console.log("firstTimeConverted", firstTimeConverted);

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % frequencyInFirebase;
  console.log("tRemainder", tRemainder);

  // Minute(s) Until Train
  var tMinutesTillTrain = frequencyInFirebase - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var arrivalTime = moment(nextTrain).format("hh:mm")
  console.log("ARRIVAL TIME: " + arrivalTime);

  // Add each train's data into the table
  $("#train-table > tbody").append(
    "<tr><td>" + trainNameInFirebase +
    "</td><td>" + desinationInFirebase +
    "</td><td>" + frequencyInFirebase +
    "</td><td>" + arrivalTime +
    "</td><td>" + tMinutesTillTrain +
    "</td></tr>");
});