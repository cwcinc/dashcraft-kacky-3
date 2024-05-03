const tracks = [];
const IDarr = [];
const numbers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]


function retrieveMaps() {
  while (tracks.length > 0) {
    tracks.pop();
  }
  if (document.getElementById("checkbox").checked) {
    var url = "https://api.dashcraft.io/trackv2/global3?sort=new&verifiedOnly=true&page="
  } else {
    var url = "https://api.dashcraft.io/trackv2/global3?sort=new&verifiedOnly=false&page="
  }
  var fetches = [];
  for (let i = 0; i < 1000; i++) {
    fetches.push(
      fetch(url + i + "&pageSize=50")
        .then((response) => response.json())
        .then((json) => {

          let json1 = json.tracks;
          let IDarr = [];
          for (let a = 0; a < json1.length; a++) {
            IDarr.push(json1[a]._id);
          }
          return IDarr;
        }));

  }

  Promise.all(fetches)
    .then((IDL) => {
      while (IDarr.length > 0) {
        IDarr.pop();
      }
      for (let a = 0; a < IDL.length; a++) {
        for (let b = 0; b < IDL[a].length; b++) {
          IDarr.push(IDL[a][b]);
        }
      }
      for (let j = 0; j < IDarr.length; j++) {
        if (j == IDarr.length - 1) {
          getInfo(IDarr[j], true)
        } else {
          getInfo(IDarr[j], false)
        }

      }


    });
}

function getInfo(ID, isDone) {
  fetch("https://api.dashcraft.io/trackv2/" + ID + "?supportsLaps1=true", {
    headers: {
      'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
    }
  })
    .then((response) => response.json())
    .then((json) => tracks.push(json))
    .then(() => calculate(isDone));
}

function calculate(isDone) {
  if (isDone) {

    console.log(tracks)

    document.getElementById("players").innerHTML = "Players: " + Math.round(tracks.reduce((total, current) => total + current.leaderboardTotalCount, 0) / tracks.length);
    document.getElementById("likes").innerHTML = "Likes: " + Math.round(tracks.reduce((total, current) => total + current.likesCount, 0) / tracks.length);
    document.getElementById("dislikes").innerHTML = "Dislikes: " + Math.round(tracks.reduce((total, current) => total + current.dislikesCount, 0) / tracks.length);






  }
}


function playerLookup() {
  var players = []
  var playerlookup = document.getElementById("playerlookup")
  var link = document.getElementById("profilelink")
  var lbdata = document.getElementById("lbdata")
  var track = document.getElementById("tracks")
  for (let i = 0; i < tracks.length; i++) {
    for (let j = 0; j < tracks[i].leaderboard.length; j++) {
      if ((tracks[i].leaderboard[j].user.username).includes(document.getElementById("player").value)) {
        if (!players.find(({ username }) => username === tracks[i].leaderboard[j].user.username)) {
          players.push(tracks[i].leaderboard[j].user)
        }
      }
    }
  }
  console.log(players)
  link.innerHTML = ""
  for (let i = 0; i < players.length; i++) {
    link.innerHTML += "<a href='https://dashcraft.io/?u=" + players[i]._id + "' target='_blank'>" + players[i].username + "</a><br>"
  }
  if (players.length > 1) {
    playerlookup.innerHTML += "More than one player found so advanced data is not displayed"
  } else if (players.length == 0) {
    link.innerHTML = "No players found"
  }
  if (!document.getElementById("checkbox").checked) {
    playerlookup.innerHTML += "<br>Leaderboard info not shown on global leaderboard"
  } else if (players.length == 1) {
    lbdata.innerHTML += "<br><h4>Leaderboard Data</h4>"
    lbdata.innerHTML += getPositions(players[0])
    track.innerHTML += "<br><h4>Tracks</h4>"
    getTracks(players[0])

  }
}

function getTracks(player) {
  var fetches = [];
  for (let i = 0; i < 10; i++) {
    fetches.push(
      fetch("https://api.dashcraft.io/trackv2/user/public/" + player._id + "?page=" + i + "&pageSize=50")
        .then((response) => response.json())
        .then((json) => {

          let json1 = json.tracks;
          let IDarr = [];
          for (let a = 0; a < json1.length; a++) {
            IDarr.push(json1[a]._id);
          }

          return IDarr;
        }));
  }
  console.log(fetches)
  Promise.all(fetches)
    .then((IDL2) => {
      while (IDarr.length > 0) {
        IDarr.pop();
      }
      for (let a = 0; a < IDL2.length; a++) {
        for (let b = 0; b < IDL2[a].length; b++) {
          IDarr.push(IDL2[a][b]);
        }
      }
      console.log(IDarr)
      var html = ""
      for (let i = 0; i < IDarr.length; i++) {
        html += "<a href='https://dashcraft.io/?t=" + IDarr[i] + "' target='_blank'>" + "https://dashcraft.io/?t=" + IDarr[i] + "</a><br>"
      }
      document.getElementById("tracks").innerHTML += html
    });
  
}


function getPositions(player) {
  var positions = [];
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].leaderboard.find(({ user }) => user._id === player._id)) {
      positions.push({ position: (tracks[i].leaderboard.findIndex(({ user }) => user._id === player._id) + 1), mapper: tracks[i].user.username, link: "https://dashcraft.io/?t=" + tracks[i]._id, wr: tracks[i].leaderboard[0].time, time: tracks[i].leaderboard.find(({ user }) => user._id === player._id).time });
    }
  }
  console.log(positions)
  positions.sort((a, b) => (b.time - b.wr) - (a.time - a.wr));
  var html = ""
  for (let i = 0; i < positions.length; i++) {
    html += "<a href='" + positions[i].link + "' target='_blank'>" + positions[i].mapper + "</a>'s track: " + numbers[positions[i].position - 1] + " place, " + (Math.round((positions[i].time - positions[i].wr) * 10000) / 10000) + " seconds away from world record<br>"
  }
  return html
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

