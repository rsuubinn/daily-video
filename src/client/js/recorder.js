const video = document.getElementById("preview");
const recorderBtn = document.getElementById("recorderBtn");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  recorderBtn.removeEventListener("click", handleDownload);
  recorderBtn.innerText = "변환 중";
  recorderBtn.disabled = true;
};

// 촬영하기 버튼 누를 시 발생되는 이벤트 핸들러
const handleStart = () => {
  recorderBtn.innerText = "녹화중";
  recorderBtn.disabled = true;
  recorderBtn.removeEventListener("click", handleStart);

  // stream을 매개변수로 MediaRecorder 생성자를 호출
  recorder = new window.MediaRecorder(stream, {
    mimeType: "video/webm",
  });

  // 비디오 녹화가 끝날 시 실행
  recorder.ondataavailable = (event) => {
    const videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
    recorderBtn.innerText = "다운로드";
    recorderBtn.disabled = false;
    recorderBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 3000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      width: 50,
      hiehgt: 50,
    },
  });
  video.srcObject = stream;
  video.play();
};

init();

recorderBtn.addEventListener("click", handleStart);
