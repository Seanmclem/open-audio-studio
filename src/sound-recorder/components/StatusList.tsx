import React from 'react';
import styled from 'styled-components'

const Container = styled.div`
    border: 1px solid black;
    margin: 5px;
`

const List = styled.ul`

`

export const StatusList: React.FC<any> = ({ children }) => {

    return (
        <Container>
            <List>
                {children}
            </List>
        </Container>
    )
}