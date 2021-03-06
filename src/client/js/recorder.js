import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const video = document.getElementById("preview");
const recorderBtn = document.getElementById("recorderBtn");

let stream;
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = async (fileUrl, fileName) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async (req, res) => {
  recorderBtn.removeEventListener("click", handleDownload);
  recorderBtn.innerText = "인코딩 중";
  recorderBtn.disabled = true;

  const ffmpeg = createFFmpeg({
    log: true,
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  });
  await ffmpeg.load();

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));

  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "My Daily Video.mp4");
  downloadFile(thumbUrl, "My Thumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  recorderBtn.disabled = false;
  recorderBtn.innerText = "다시 촬영하기";
  recorderBtn.addEventListener("click", handleStart);
};

// 촬영하기 버튼 누를 시 발생되는 이벤트 핸들러
const handleStart = () => {
  recorderBtn.innerText = "녹화중";
  recorderBtn.disabled = true;
  recorderBtn.removeEventListener("click", handleStart);

  // stream을 매개변수로 MediaRecorder 생성자를 호출
  recorder = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });

  // 비디오 녹화가 끝날 시 실행
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
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
