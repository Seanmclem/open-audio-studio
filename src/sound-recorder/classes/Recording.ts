export class Recording {
    chunks: Blob[] = []

    constructor() {
        this.startRecording()
    }

    startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
            console.log("Started?")
            const mediaRecorder = new MediaRecorder(stream)
            mediaRecorder.start()
            console.log('mediaRecorder.state:', mediaRecorder.state) //"recording"

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                this.chunks.push(event.data);
            }

            mediaRecorder.onstop = (_event: Event) => {
                console.log('chunk(s) final', this.chunks)
                stream.getTracks().forEach(track => track.stop());
                const blob = new Blob(
                    this.chunks,
                    { 'type': 'audio/ogg; codecs=opus' }
                );
                this.chunks = [];
                const audioURL = window.URL.createObjectURL(blob);

                this.createAudioElement(audioURL);
                console.log('audioURL', audioURL)
            }

            setTimeout(() => {
                console.log("stopping...")
                mediaRecorder.stop();
                console.log("mediaRecorder.state", mediaRecorder.state);
            }, 4000)
        } else {
            console.log('getUserMedia not supported on your browser!')
        }
    }

    createAudioElement(blobUrl: string) {
        const downloadEl = document.createElement('a');
        // downloadEl.style = 'display: block';
        downloadEl.innerHTML = 'download';
        downloadEl.download = 'audio.webm';
        downloadEl.href = blobUrl;
        const audioEl = document.createElement('audio');
        audioEl.controls = true;
        const sourceEl = document.createElement('source');
        sourceEl.src = blobUrl;
        sourceEl.type = 'audio/webm';
        audioEl.appendChild(sourceEl);
        document.body.appendChild(audioEl);
        document.body.appendChild(downloadEl);
    }

}