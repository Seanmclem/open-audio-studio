import React from 'react';
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

    const startRecording = async () => {
        const hat = new Recording;
    }

    return (
        <Container>
            {/* <StatusList>
                <StatusItem
                    title="recording"
                    status="in-progress"
                />
                <StatusItem
                    title="recording started"
                    status="success"
                />
                <StatusItem
                    title="recording stopped"
                    status="not-started"
                />
            </StatusList> */}
            <RecordButton onClick={startRecording}>
                Record
            </RecordButton>
        </Container>
    )
}