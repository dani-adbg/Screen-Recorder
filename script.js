addEventListener('DOMContentLoaded', () => {
  const doc = document;

  const start = doc.querySelector('#start');
  const pause = doc.querySelector('#pause');
  const resume = doc.querySelector('#resume');
  const stop = doc.querySelector('#stop');

  let mediaRecoder, media;
  let isRecording = false;

  async function startRecording() {
    if(isRecording) {
      try {
        media = await navigator.mediaDevices.getDisplayMedia({
          audio: true,
          video: { frameRate: { ideal: 30 }}
        });
        const options = {
          mimeType: 'video/webm;codecs=vp8,opus'
        };

        mediaRecoder = new MediaRecorder(media, options);
        mediaRecoder.start();
      } catch (error) {
        console.log("No se pudo grabar", error);
      }
    }
  }

  start.addEventListener('click', () => {
    isRecording = true;
    console.log("start")
    startRecording();
  });

  pause.addEventListener('click', () => {
    if(!mediaRecoder.state || mediaRecoder.state === 'inactive') return;
    console.log("pause")
    mediaRecoder.pause();
  });

  resume.addEventListener('click', () => {
    if(mediaRecoder.state !== 'paused') return;
    console.log("resume")
    mediaRecoder.resume();
  });

  stop.addEventListener('click', () => {
    media.getVideoTracks()[0].stop();
    mediaRecoder.addEventListener('dataavailable', (event) => {
      const link = doc.createElement('a');
      link.href = URL.createObjectURL(event.data);
      link.download = `recording-${new Date()}.webm`;
      link.click();
    })
    mediaRecoder.stop();
    console.log(mediaRecoder)
  });
})