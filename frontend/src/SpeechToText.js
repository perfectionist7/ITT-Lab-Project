// SpeechToText.js
import React, { Component } from 'react';
import styled from 'styled-components';

const StyledButton = styled.button`
  background-color: #36454f;
  color: #FFFFFF;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #005A77;
  }
`;

const SpeechIcon = styled.i`
  margin-right: 10px;
`;

class SpeechToTextButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListening: false
    };
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';
  }

  componentDidMount() {
    this.recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      this.props.setText(text); // Pass the recognized text to the parent component
    };
  }

  toggleRecognition = () => {
    if (!this.state.isListening) {
      this.recognition.start();
    } else {
      this.recognition.stop();
    }
    this.setState((prevState) => ({
      isListening: !prevState.isListening
    }));
  };

  render() {
    return (
      <StyledButton onClick={this.toggleRecognition}>
        <SpeechIcon className={`fa ${this.state.isListening ? 'fa-stop' : 'fa-microphone'}`} />
        {this.state.isListening ? 'Stop Recording' : 'Speech to Text'}
      </StyledButton>
    );
  }
}

export default SpeechToTextButton;
