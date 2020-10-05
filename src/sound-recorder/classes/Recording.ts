import { Dispatch, SetStateAction } from "react"

interface IRecording {
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>;
    setTimeElapsed: Dispatch<SetStateAction<number>>;
}

export class Recording {
    timeElapsed: number = 0
    recordingTimeout: any
    timeElapsedTimeout: any
    chunks: Blob[] = []
    setCurrentlyRecording: Dispatch<SetStateAction<boolean>>
    setTimeElapsed: Dispatch<SetStateAction<number>>

    constructor({ setCurrentlyRecording, setTimeElapsed }: IRecording) {
        this.startRecording()
        this.setCurrentlyRecording = setCurrentlyRecording
        this.setTimeElapsed = setTimeElapsed
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
            this.trackTimeElapsed();
            this.setTimeLimit(mediaRecorder, 5);
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

    trackTimeElapsed() { // short by ~300ms?
        // NOTES
        // Well, fuck the timeout, do the date thing?
        // Then, or instead, just try and get the duration from the recording data.
        // with npms get-blob-duration? not installed yet

        // revelation: you can track multiple date-time-stamps/can-be-paused-date-timing
        // ^ by using an array of {on/off} timeestamps and combining their differences
        this.timeElapsedTimeout = setTimeout(() => {
            this.timeElapsed = this.timeElapsed + 100;
            this.setTimeElapsed(this.timeElapsed);
            this.trackTimeElapsed();
        }, 100)
    }

    setTimeLimit(mediaRecorder: MediaRecorder, secondsLimit: number) {
        this.recordingTimeout = setTimeout(() => {
            mediaRecorder.stop();
            clearTimeout(this.recordingTimeout); // move to onstop?
            clearTimeout(this.timeElapsedTimeout);
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