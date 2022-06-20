const video = document.querySelector("video");
const playBtn = document.getElementById("playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const volume = document.getElementById("volume");

let videoVolume = 0.5;
video.volume = videoVolume;

const handlePlayBtnClick = () => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.className = video.paused ? "fas fa-play" : "fas fa-pause";
};

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handleCurrentTime = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleMuteBtnClick = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.className = video.muted
    ? "fas fa-volume-up"
    : "fas fa-volume-mute";
  volume.value = video.muted ? 0 : videoVolume;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    // muteBtnIcon.className = "fas fa-volume-up";
  }
  video.volume = value;
  videoVolume = value;

  if (Number(value) === 0) {
    muteBtnIcon.className = "fas fa-volume-mute";
    muteBtn.dispatchEvent(new Event("click"));
  }
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleCurrentTime);
timeline.addEventListener("input", handleTimelineChange);
volume.addEventListener("input", handleVolumeChange);
