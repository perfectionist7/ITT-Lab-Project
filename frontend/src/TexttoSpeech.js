import React, { Component } from 'react';
import styled from 'styled-components';



const StyledButton = styled.button`
  background-color: #36454f;
  color: #FFFFFF;
  border: 3px solid grey; /* Add border */
  border-radius: 20px; /* Adjust the border radius for rounded buttons */
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

class TextToSpeech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSpeaking: false,
      speechText: props.textToSpeak || ''
    };
  }

  componentDidUpdate(prevProps) {
    // Check if the textToSpeak prop has changed
    if (this.props.textToSpeak !== prevProps.textToSpeak) {
      this.setState({ speechText: this.props.textToSpeak });
    }
  }

  speakText = () => {
    const speechSynthesis = window.speechSynthesis;
    const speechText = new SpeechSynthesisUtterance(this.state.speechText);
    
    if (!this.state.isSpeaking) {
      speechSynthesis.speak(speechText);
    } else {
      speechSynthesis.cancel();
    }
    
    this.setState(prevState => ({
      isSpeaking: !prevState.isSpeaking
    }));
  };

  render() {
    return (
      <StyledButton onClick={this.speakText}>
        <SpeechIcon className={`fa ${this.state.isSpeaking ? 'fa-stop' : 'fa-volume-up'}`} />
        {this.props.buttonText || (this.state.isSpeaking ? 'Stop Speaking' : 'Read')}
        {/* Change 'Read' to your preferred default button text */}
      </StyledButton>
    );
  }
}

export default TextToSpeech;
