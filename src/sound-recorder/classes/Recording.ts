import { Dispatch, SetStateAction } from "react"
import getBlobDuration from "get-blob-duration"

interface IRecording {
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>;
    setTimeElapsed: Dispatch<SetStateAction<number>>;
    secondsLimit: number;
}

export class Recording {
    timeElapsed: number = 0
    recordingTimeout: any
    timeElapsedTimeout: any
    chunks: Blob[] = []
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>
    setTimeElapsed: Dispatch<SetStateAction<number>>
    secondsLimit: number

    constructor({ setCurrentlyRecording, setTimeElapsed, secondsLimit }: IRecording) {
        this.setCurrentlyRecording = setCurrentlyRecording
        this.setTimeElapsed = setTimeElapsed
        this.secondsLimit = secondsLimit
        this.startRecording()
    }

    startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            this.registerEventHandlers(mediaRecorder, stream);
            mediaRecorder.start();
        } else {
            console.log('getUserMedia not supported on your browser!')
        }
    }

    registerEventHandlers(mediaRecorder: MediaRecorder, stream: MediaStream) {
        mediaRecorder.ondataavailable = (event: BlobEvent) => {
            this.chunks.push(event.data);
        }
        mediaRecorder.onstart = (_event: Event) => {
            this.setCurrentlyRecording(true);
            this.trackTimeElapsed(mediaRecorder, this.secondsLimit);
        }
        mediaRecorder.onstop = (_event: Event) => {
            const blob = new Blob(
                this.chunks,
                { 'type': 'audio/ogg; codecs=opus' }
            );
            const audioURL = window.URL.createObjectURL(blob);
            this.createAudioElement(audioURL);
            this.getDuration(blob)
            this.cleanup(stream);
        }
    }

    async getDuration(blob: Blob) {
        const duration = await getBlobDuration(blob)
        console.log('duration', duration)
    }

    trackTimeElapsed(mediaRecorder: MediaRecorder, secondsLimit: number) { // short by ~300ms?
        // NOTES
        // Well, fuck the timeout, do the date thing?
        // Then, or instead, just try and get the duration from the recording data.
        // with npms get-blob-duration? not installed yet

        // revelation: you can track multiple date-time-stamps/can-be-paused-date-timing
        // ^ by using an array of {on/off} timeestamps and combining their differences
        // ...went with a better timeout for now

        const incerement = 100;

        this.timeElapsedTimeout = setTimeout(() => {
            this.timeElapsed = this.timeElapsed + incerement;
            this.setTimeElapsed(this.timeElapsed);

            if (this.timeElapsed >= (secondsLimit * 1000)) {
                mediaRecorder.stop();
                clearTimeout(this.timeElapsedTimeout);
            } else {
                this.trackTimeElapsed(mediaRecorder, secondsLimit);
            }
        }, incerement)
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