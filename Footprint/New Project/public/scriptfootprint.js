function initialize() {
  console.log("initialized");
  retrieveLog();
}

function addData() {
  var name = document.getElementById("name").value;
  var location = document.getElementById("loc").value;
  writeUserData(name, location);
  toggleIsChecked(name);
}

function writeUserData(name, loc) {
  var today = new Date();
  var time = today.toLocaleTimeString('en-US');
  firebase.database().ref('Entries/').push().set({
    Name: name,
    Time: time,
    Location: loc
  });
}

function retrieveLog() {
  var rootRef = firebase.database().ref().child("Entries");
  var names = new Array();
  var times = new Array();
  var locations = new Array();
  var entries = new Array(new Array("Name", "Time", "Location"));
  rootRef.on("child_added", snap => {
    var name = snap.child("Name").val();
    var time = snap.child("Time").val();
    var location = snap.child("Location").val();
    names.push(name);
    times.push(time);
    locations.push(location);
  });

  for (var i = 0; i <= names.length; i++) {
    entries[i + 1] = new Array(names[i], times[i], locations[i]);
    //console.log(entries[i]);
  }

  return entries;
}

function clearLog() {
  var rootRef = firebase.database().ref().child("Entries");
  rootRef.remove();
}

function register() {
  var name = document.getElementById("reg").value;
  console.log(name);
  firebase.database().ref('Employees/' + name).set({
    IsChecked: "false"
  });
}

function toggleIsChecked(name) {
  var rootRef = firebase.database().ref().child("Employees/" + name);
  rootRef.on("child_added", snap => {
    var isChecked = snap.val();
    if (isChecked == "false")
      firebase.database().ref('Employees/' + name).set({
        IsChecked: "true"
      });
    else {
      firebase.database().ref('Employees/' + name).set({
        IsChecked: "false"
      });
    }
  });
}

function errData(err) {
  console.log('Error!');
  console.log(err);
}

function genTable() {
  var tableData = retrieveLog();

  var parentDiv = $("#parentHolder");
  parentDiv.html("");
  var aTable = $("<table>", {
    "id": "newTable"
  }).appendTo(parentDiv);
  var rowCount = tableData.length;
  var colmCount = tableData[0].length;

  // For loop for adding header .i.e th to our table
  for (var k = 0; k < 1; k++) {
    var fragTrow = $("<tr>", {
      "class": "trClass"
    }).appendTo(aTable);
    for (var j = 0; j < colmCount; j++) {
      $("<th>", {
        "class": "thClass"
      }).appendTo(fragTrow).html(tableData[k][j]);
    }
  }

  //For loop for adding data .i.e td with data to our dynamic generated table
  for (var i = 1; i < rowCount; i < i++) {
    var fragTrow = $("<tr>", {
      "class": "trClass"
    }).appendTo(aTable);
    for (var j = 0; j < colmCount; j++) {
      $("<td>", {
        "class": "tdClass"
      }).appendTo(fragTrow).html(tableData[i][j]);
    }
  }
}
