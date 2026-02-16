let stream;
let mediaRecorder;
let recordedChunks = [];

let attemptId = null;
let testType = null;
let token = localStorage.getItem("token");

export function initProctoring(id, type) {
  attemptId = id;
  testType = type;

  enableFullscreen();
  setupListeners();
  startCamera();
}

function enableFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}

function setupListeners() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      sendViolation("Tab Switch");
    }
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) {
      sendViolation("Fullscreen Exit");
    }
  });

  document.addEventListener("copy", () => {
    sendViolation("Copy Attempt");
  });

  document.addEventListener("paste", () => {
    sendViolation("Paste Attempt");
  });

  setInterval(() => {
    if (window.outerWidth - window.innerWidth > 160) {
      sendViolation("DevTools Opened");
    }
  }, 2000);
}

async function startCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.start();

    monitorTracks();

  } catch (err) {
    alert("Camera & Mic required!");
    window.location.href = "dashboard.html";
  }
}

function monitorTracks() {
  setInterval(() => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const audioTrack = stream.getAudioTracks()[0];

    if (!videoTrack.enabled) {
      sendViolation("Camera Off");
    }

    if (!audioTrack.enabled) {
      sendViolation("Mic Muted");
    }
  }, 3000);
}

async function sendViolation(type) {
  try {
    await fetch("http://localhost:5000/api/proctor/violation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        attemptId,
        testType,
        violationType: type
      })
    });
  } catch (err) {
    console.log("Violation failed");
  }
}

export async function stopRecordingAndUpload() {
  if (!mediaRecorder) return;

  mediaRecorder.stop();

  setTimeout(async () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });

    const formData = new FormData();
    formData.append("video", blob);
    formData.append("attemptId", attemptId);
    formData.append("testType", testType);

    await fetch("http://localhost:5000/api/proctor/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
  }, 1000);
}
