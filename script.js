let currentsong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }

  return songs;
}

const playMusic = (track, pause = false) => {
  currentsong.src = "/songs/" + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function main() {
  //Get the list of all songs
  songs = await getSongs();
  playMusic(songs[0], true);

  //show all the song in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
            <img class="invert" src="music.svg" alt="" />
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Jay</div>
            </div>
            <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="play.svg" alt="" />
            </div>
        </li>`;
  }

  //arracheed a eventlistner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(element);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //attached a event listner to play next previoous
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  //listen for timeupdate
  currentsong.addEventListener("timeupdate", () => {
    console.log(currentsong.currentTime, currentsong.duration);
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}:${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  //Add an event to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  //Add event listner to prev button
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 > songs.length) {
      playMusic(songs[index + 1]);
    }
  });
}

main();
