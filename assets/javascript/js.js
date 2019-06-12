$(document).ready(function () {
    var firebaseConfig = {
      apiKey: "AIzaSyDeglERvs-wD4bblWTDJgbRng-IJw9MZQo",
      authDomain: "train-schedule-bdea1.firebaseapp.com",
      databaseURL: "https://train-schedule-bdea1.firebaseio.com",
      projectId: "train-schedule-bdea1",
      storageBucket: "train-schedule-bdea1.appspot.com",
      messagingSenderId: "630434089584",
      appId: "1:630434089584:web:9307d45c976724ac"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    var database = firebase.database();
  
    // Capture Button Click
    $("#addTrain").on("click", function (event) {
      event.preventDefault();
  
      // Grabbed values from text boxes
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var freq = $("#interval").val().trim();
  
      // Code for handling the push
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: freq
      });
    });
  
  
    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function (childSnapshot) {
  
      var newTrain = childSnapshot.val().trainName;
      var newLocation = childSnapshot.val().destination;
      var newFirstTrain = childSnapshot.val().firstTrain;
      var newFreq = childSnapshot.val().frequency;
  
      // First Time (pushed back 1 year to make sure it comes before current time)
      var startTimeConverted = moment(newFirstTrain, "hh:mm").subtract(1, "years");
  
      // Current Time
      var currentTime = moment();
  
      // Difference between the times
      var diffTime = moment().diff(moment(startTimeConverted), "minutes");
  
      // Time apart (remainder)
      var tRemainder = diffTime % newFreq;
  
      // Minute(s) Until Train
      var tMinutesTillTrain = newFreq - tRemainder;
  
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      var catchTrain = moment(nextTrain).format("HH:mm");
  
      // Display On Page
      $("#all-display").append(
        ' <tr><td>' + newTrain +
        ' </td><td>' + newLocation +
        ' </td><td>' + newFreq +
        ' </td><td>' + catchTrain +
        ' </td><td>' + tMinutesTillTrain + ' </td></tr>');
  
      // Clear input fields
      $("#trainName, #destination, #firstTrain, #interval").val("");
      return false;
    },
      //Handle the errors
      function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
      });
  
  });