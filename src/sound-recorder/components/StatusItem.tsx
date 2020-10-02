import React from 'react'
import styled from 'styled-components'

const Container = styled.li`
    margin: 10px;
`

export const StatusItem = ({
    title,
    status
}: {
    title: string;
    status: 'not-started' | 'success' | 'failed' | 'in-progress'
}) => {

    return (
        <Container>
            {title} : {status}
        </Container>
    )
}