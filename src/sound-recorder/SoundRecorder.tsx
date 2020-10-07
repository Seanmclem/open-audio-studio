import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components'
import { StatusList } from './components/StatusList';
import { StatusItem } from './components/StatusItem';
import { Recording } from './classes/Recording';

const Container = styled.div`
    border: 1px solid black;
    margin: 20px;
`

const RecordButton = styled.button`
    margin: 20px;
`

export const SoundRecorder = () => {
    const [currentlyRecording, setCurrentlyRecording] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const secondsLimit = 6;

    useEffect(() => {
        console.log('timeElapsed', timeElapsed)
    }, [timeElapsed])

    const startRecording = useCallback(() => {
        new Recording({ setCurrentlyRecording, setTimeElapsed, secondsLimit });
    }, [])

    return (
        <Container>
            <StatusList>
                <StatusItem
                    title="recording"
                    status={currentlyRecording ? 'in-progress' : 'not-started'}
                />
                {/* <StatusItem
                    title="recording started"
                    status="success"
                />
                <StatusItem
                    title="recording stopped"
                    status="not-started"
                /> */}
            </StatusList>
            <div>
                Time: {`${(timeElapsed / 1000).toFixed(1)}/${secondsLimit}`}
            </div>
            <RecordButton onClick={startRecording}>
                Record
            </RecordButton>
        </Container>
    )
}