const upload = document.getElementById('upload');
const detectButton = document.getElementById('detect');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

upload.addEventListener('change', async () => {
  const file = upload.files[0];
  if (!file) return;

  const imgURL = URL.createObjectURL(file);
  const img = new Image();
  img.src = imgURL;
  await img.decode();

  // Set canvas size
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
});

detectButton.addEventListener('click', async () => {
  const file = upload.files[0];
  if (!file) {
    alert('Please select an image first');
    return;
  }

  console.log('Starting API call...');
  // Send to backend
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Sending request to /inference...');
    const res = await fetch('/inference', {
      method: 'POST',
      body: formData
    });
    console.log('Response received:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Server error:', errorText);
      throw new Error(`Server error: ${res.status} - ${errorText}`);
    }
    
    const data = await res.json();
    console.log('API Response:', data);

    // Check if we have results in the response
    if (!data || !data.images || !data.images[0] || !data.images[0].results) {
      console.error('Invalid response format:', data);
      return;
    }

    const results = data.images[0].results;
    console.log('Detection results:', results);

    // Filter only person detections
    const personDetections = results.filter(result => result.name === 'person');
    console.log('Person detections:', personDetections);

    // Draw boxes if there are any person detections
    if (personDetections && personDetections.length > 0) {
      personDetections.forEach(result => {
        if (result.box) {
          const { x1, y1, x2, y2 } = result.box;
          const width = x2 - x1;
          const height = y2 - y1;
          
          ctx.beginPath();
          ctx.rect(x1, y1, width, height);
          ctx.lineWidth = 2;
          ctx.strokeStyle = "red";
          ctx.stroke();
          ctx.font = "16px Arial";
          ctx.fillStyle = "red";
          ctx.fillText(`Person (${(result.confidence * 100).toFixed(1)}%)`, x1, y1 - 5);
        }
      });
    } else {
      console.log('No persons detected in the image');
    }
  } catch (error) {
    console.error('Error during API call:', error);
    console.error('Full error details:', error.message);
    alert('Error during detection: ' + error.message);
  }
});
