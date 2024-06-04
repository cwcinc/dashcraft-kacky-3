const tracks = [];
const IDarr = ["https://dashcraft.io/?t=65ac62b6bfde41e9d30919dc", "https://dashcraft.io/?t=65ac5563bfde41e9d3090753", "https://dashcraft.io/?t=65e381918fb6a718f9a9410a", "https://dashcraft.io/?t=65f7a5d07bb0068befad371d", "https://dashcraft.io/?t=65f7aed67bb0068befad413b", "https://dashcraft.io/?t=65f7d7557bb0068befad8562", "https://dashcraft.io?t=65fe36fbd624bd26b4d39528", "https://dashcraft.io/?t=65f860427bb0068befaf06f7", "https://dashcraft.io/?t=65f869ed7bb0068befaf252e", "https://dashcraft.io/?t=65f88ec47bb0068befaf95cc", "https://dashcraft.io?t=65ff075dd624bd26b4d59937", "https://dashcraft.io/?t=65f7b8047bb0068befad4f9c", "https://dashcraft.io/?t=65f8a1857bb0068befafcabd", "https://dashcraft.io/?t=65f905f77bb0068befb0a4ca", "https://dashcraft.io/?t=65f9fb137bb0068befb39a83", "https://dashcraft.io/?t=65fa1fcc7bb0068befb3e8fd", "https://dashcraft.io/?t=65fa23e37bb0068befb3f093", "https://dashcraft.io?t=65fcf765d624bd26b4ce7381", "https://dashcraft.io/?t=65fcf5bed624bd26b4ce7165", "https://dashcraft.io/?t=65fdc9f1d624bd26b4d24e1b"];
const mappers = ["PhantomInfinity", "PhantomInfinity", "PhantomInfinity", "PhantomInfinity", "PhantomInfinity", "Zingman", "PhantomInfinity", "C32ardash", "C32ardash", "Zingman", "PhantomInfinity", "PhantomInfinity", "C32ardash", "PhantomInfinity", "Zingman", "PhantomInfinity", "PhantomInfinity", "PhantomInfinity", "SoftReset", "Zingman"]
const numbers = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"]
const leagues = ["Bronze 1", "Bronze 2", "Bronze 3", "Silver 1", "Silver 2", "Silver 3", "Gold 1", "Gold 2", "Gold 3", "Diamond"]
const points = []

for (let i = 0; i < IDarr.length; i++) {
  IDarr[i] = IDarr[i].slice(IDarr[i].length - 24, IDarr[i].length)
  document.getElementById("tracks").innerHTML += "<a href=https://dashcraft.io/?t=" + IDarr[i] + ">https://dashcraft.io/?t=" + IDarr[i] + "</a> by " + mappers[i] + "<br>";
}


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
      getInfo()
    })
}


function getInfo() {
  document.getElementById("data").hidden = false

  var fetches = []
  for (let i = 0; i < IDarr.length; i++) {
    fetches.push(fetch("https://api.dashcraft.io/trackv2/" + IDarr[i] + "?supportsLaps1=true", {
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWM0NmMzNGExYmEyMjQyNGYyZTAwMzIiLCJpbnRlbnQiOiJvQXV0aCIsImlhdCI6MTcwNzM3MTU3Mn0.0JVw6gJhs4R7bQGjr8cKGLE7CLAGvyuMiee7yvpsrWg'
      }
    })
      .then((response) => response.json())
      .then((json) => {
        return (json)
      })
    )
  }
  Promise.all(fetches)
    .then((IDL) => {
      console.log(IDL)
      while (tracks.length > 0) {
        tracks.pop();
      }
      for (let a = 0; a < IDL.length; a++) {
        tracks.push(IDL[a]);
      }
      calculate()


    });
}

function calculate() {


  console.log(tracks)



  document.getElementById("leaderboard").innerHTML += countPoints();




}

// player lookup
function playerLookup() {
  var players = []
  var playerlookup = document.getElementById("playerlookup")
  var link = document.getElementById("profilelink")
  var lbdata = document.getElementById("lbdata")
  link.innerHTML = ""
  lbdata.innerHTML = ""
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

  for (let i = 0; i < players.length; i++) {
    link.innerHTML += "<a href='https://dashcraft.io/?u=" + players[i]._id + "' target='_blank'>" + players[i].username + "</a><br>"
  }
  if (players.length > 1) {
    link.innerHTML += "More than one player found so advanced data is not displayed"
  } else if (players.length == 0) {
    link.innerHTML = "No players found"
  }
  if (players.length == 1) {
    
    link.innerHTML += "Level " + players[0].levelData.level + " (" + players[0].levelData.xpInLevel + "/" + players[0].levelData.totalXpInLevel + ")"
    link.innerHTML += "<br>" + leagues[players[0].leagueNr]
  }
  if (false) {
    lbdata.innerHTML += "<br><h4>Leaderboard Data</h4><br>Leaderboard info not shown on global leaderboard"
  } else if (players.length == 1) {
    lbdata.innerHTML += "<h4>Leaderboard Data</h4>"
    lbdata.innerHTML += getPositions(players[0])
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
  var totals = { time: 0, position: 0, tracks: 0 }
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].leaderboard.find(({ user }) => user._id === player._id)) {
      positions.push({ position: (tracks[i].leaderboard.findIndex(({ user }) => user._id === player._id) + 1), mapper: tracks[i].user.username, link: "https://dashcraft.io/?t=" + tracks[i]._id, wr: tracks[i].leaderboard[0].time, time: tracks[i].leaderboard.find(({ user }) => user._id === player._id).time });
      totals.time += positions[positions.length - 1].time
      totals.position += positions[positions.length - 1].position
      totals.tracks += 1
    } else {
      if (tracks[i].leaderboard.length > 0) {
        positions.push({ position: 11 , mapper: tracks[i].user.username, link: "https://dashcraft.io/?t=" + tracks[i]._id, wr: tracks[i].leaderboard[0].time, time: 100000 })
      } else {
        
      }
    }
  }
  console.log(positions)
  positions.sort((a, b) => (b.position) - (a.position));
  console.log(totals)
  totals.time = Math.round(totals.time * 10000) / 10000
  totals.position = Math.round(totals.position * 100) / 100
  if (positions.find(({ position }) => position === 11)) {
    totals.time += " (not top 10 on all tracks)"
  }
  var html = "Total time: " + totals.time + "<br>Average position: " + totals.position / totals.tracks + "<br>"
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].position == 11) {
      html += "<br><a href='" + positions[i].link + "' target='_blank'>" + positions[i].mapper + "</a>'s track: Not top 10"
    } else {
      html += "<br><a href='" + positions[i].link + "' target='_blank'>" + positions[i].mapper + "</a>'s track: " + numbers[positions[i].position - 1] + " place ("
      if (positions[i].position == 1) {
        html += "Holds world record)"
      } else
        html += (Math.round((positions[i].time - positions[i].wr) * 10000) / 10000) + " seconds away from world record)"
    }
  }
  return html
}

function countPoints() {
  for (let i = 0; i < tracks.length; i++) {
    for (let j = 0; j < tracks[i].leaderboard.length; j++) {
      if (points.find(({ username }) => username === tracks[i].leaderboard[j].user.username) != undefined) {
        points.find(({ username }) => username === tracks[i].leaderboard[j].user.username).points += (1 - j/1000);
      } else {
        points.push({ username: tracks[i].leaderboard[j].user.username, points: (1 - j/1000) });
      }
    }
  }

  points.sort((a, b) => b.points - a.points);
  console.log(points)
  var html = ""
  for (let i = 0; i < points.length; i++) {
    points[i].points = Math.ceil(points[i].points)
    html += points[i].username + ": " + points[i].points + " points<br>"
  }
  return html
}


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

