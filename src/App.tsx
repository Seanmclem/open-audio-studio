import React from 'react';
import logo from './logo.svg';
import './App.css';

import styled from 'styled-components'
import { SoundRecorder } from './sound-recorder/SoundRecorder';

const Header = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

const App = () => {
  return (
    <div className="App">
      <SoundRecorder />
    </div>
  );
}

export default App;
