import { Dispatch, SetStateAction } from "react"

interface IRecording {
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>
}

export class Recording {
    chunks: Blob[] = []
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>

    constructor({ setCurrentlyRecording }: IRecording) {
        this.startRecording()
        this.setCurrentlyRecording = setCurrentlyRecording
    }

    startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            this.registerEventHandlers(mediaRecorder, stream);
            mediaRecorder.start();
            this.setTimeLimit(mediaRecorder, 5);
        } else {
            console.log('getUserMedia not supported on your browser!')
        }
    }

    registerEventHandlers(mediaRecorder: MediaRecorder, stream: MediaStream) {
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            this.chunks.push(event.data);
        }
        mediaRecorder.onstart = (event: Event) => {
            this.setCurrentlyRecording(true);
        }
        mediaRecorder.onstop = (_event: Event) => {
            this.cleanup(stream);
            const blob = new Blob(
                this.chunks,
                { 'type': 'audio/ogg; codecs=opus' }
            );
            const audioURL = window.URL.createObjectURL(blob);
            this.createAudioElement(audioURL);
        }
    }

    setTimeLimit(mediaRecorder: MediaRecorder, secondsLimit: number) {
        setTimeout(() => {
            mediaRecorder.stop();
        }, secondsLimit * 1000)
    }

    cleanup(stream: MediaStream) {
        this.setCurrentlyRecording(false);
        stream.getTracks().forEach(track => track.stop());
        this.chunks = [];
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