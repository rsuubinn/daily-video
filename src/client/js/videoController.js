const video = document.querySelector("video");
const videoContainer = document.getElementById("videoContainer");
const playBtn = document.getElementById("playBtn");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("muteBtn");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const volumeRange = document.getElementById("volume");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const fullscreenBtnIcon = fullscreenBtn.querySelector("i");

let volumeValue = 0.5;
video.volume = volumeValue;

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
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
  const {
    target: { value },
  } = event;

  if (video.muted) {
    video.muted = false;
    muteBtnIcon.className = "fas fa-volume-up";
  }
  video.volume = value;
  volumeValue = value;

  if (Number(value) === 0) {
    muteBtn.dispatchEvent(new Event("click"));
  }
};

const handleFullScreen = () => {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullscreenBtnIcon.className = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullscreenBtnIcon.className = "fas fa-compress";
  }
};

const handleKeyDown = (event) => {
  if (event.keyCode === 70) {
    //fullscreen
    handleFullScreen();
  } else if (event.keyCode === 32) {
    //play and pause
    event.preventDefault();
    handlePlayBtnClick();
  } else if (event.keyCode === 77) {
    //mute
    handleMuteBtnClick();
  }
};

playBtn.addEventListener("click", handlePlayBtnClick);
muteBtn.addEventListener("click", handleMuteBtnClick);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleCurrentTime);
timeline.addEventListener("input", handleTimelineChange);
volume.addEventListener("input", handleVolumeChange);
fullscreenBtn.addEventListener("click", handleFullScreen);
window.addEventListener("keydown", handleKeyDown);
