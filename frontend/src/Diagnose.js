// Diagnose.js

import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextArea,
  Grommet
} from 'grommet';
import './App.css';
import SpeechToTextButton from './SpeechToText'; // Import the SpeechToTextButton component
const theme = {
  global: {
    colors: {
      brand: '#36454f',
      focus: "#ffffff",
      active: "#000000",
    },
    font: {
      family: 'Lato',
    },
  },
};
var diagnosis = "";
var prescription = "";
var id;
const AppBar = (props) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
    {...props} />
);

export class Diagnose extends Component {
  constructor(props) {
    super(props);
    id = props.match.params.id;
    this.state = {
      diagnosisText: "",
      prescriptionText: "",
      isDiagnosisEmpty: true,
      isPrescriptionEmpty: true
    };
  }

  setDiagnosis = (text) => {
    this.setState({ diagnosisText: text, isDiagnosisEmpty: !text });
  };

  setPrescription = (text) => {
    this.setState({ prescriptionText: text, isPrescriptionEmpty: !text });
  };

  handleSubmit = (event) => {
    event.preventDefault(); // Prevent the form submission
    fetch("http://localhost:3001/diagnose?diagnosis=" + this.state.diagnosisText + "&prescription=" + this.state.prescriptionText + "&id=" + id)
      .then(() => {})
    window.alert("Diagnosis Submitted!");
  };

  render() {
    const { diagnosisText, prescriptionText, isDiagnosisEmpty, isPrescriptionEmpty } = this.state;
    return (
      <Grommet theme={theme} full>
        <AppBar>
          <a style={{ color: "#ffffff", textDecoration: "#ffffff"}} href="/"><Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal</i></Heading></a>
        </AppBar>
        <Box align="center" gap="small">
          <Form onSubmit={this.handleSubmit}> {/* Attach handleSubmit function to the form's onSubmit event */}
            <h4>Diagnosis</h4>
            <TextArea
              placeholder="Enter Diagnosis"
              label="Enter Diagnosis"
              value={diagnosisText}
              onChange={event => {this.setState({ diagnosisText: event.target.value, isDiagnosisEmpty: !event.target.value })}}
              style={{width:"50vw", height:"12vw"}}
              fill
              required={isDiagnosisEmpty}
            />
            <SpeechToTextButton  setText={this.setDiagnosis} />
            <h4>Prescription</h4>
            <TextArea
              placeholder="Enter Prescription"
              label="Enter Prescription"
              value={prescriptionText}
              onChange={event => {this.setState({ prescriptionText: event.target.value, isPrescriptionEmpty: !event.target.value })}}
              style={{width:"50vw", height:"12vw"}}
              fill
              required={isPrescriptionEmpty}
            />
            <SpeechToTextButton setText={this.setPrescription} />
            <br />
            <Box align="center">
              <Button
                label="Submit Diagnosis"
                type="submit"
                primary
              />
            </Box>
          </Form>
        </Box>
      </Grommet>
    );
  }
}

export default Diagnose;
