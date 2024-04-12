import React, { Component } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextArea,
  Grommet
} from 'grommet';
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

const AppBar = () => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: 'medium', right: 'small', vertical: 'small' }}
    style={{ zIndex: '1' }}
  >
    <Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal</i></Heading>
  </Box>
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
        <AppBar />
        <Box align="center" gap="medium" pad="medium">
          <Form onSubmit={this.handleSubmit}> {/* Attach handleSubmit function to the form's onSubmit event */}
            <Box width="large">
              <Heading level={3}>Diagnosis</Heading>
              <TextArea
                placeholder="Enter Diagnosis"
                value={diagnosisText}
                onChange={event => {this.setState({ diagnosisText: event.target.value, isDiagnosisEmpty: !event.target.value })}}
                fill
                required={isDiagnosisEmpty}
                style={{ height: '180px', marginBottom:'20px' }} // Increasreased height
              />
              <SpeechToTextButton setText={this.setDiagnosis} />
            </Box>
            <Box width="large">
              <Heading level={3}>Prescription</Heading>
              <TextArea
                placeholder="Enter Prescription"
                value={prescriptionText}
                onChange={event => {this.setState({ prescriptionText: event.target.value, isPrescriptionEmpty: !event.target.value })}}
                fill
                required={isPrescriptionEmpty}
                style={{ height: '180px', marginBottom:'20px' }} // Increased height
              />
              <SpeechToTextButton setText={this.setPrescription} />
            </Box>
            <Box align="center" style={{ marginTop: '20px' }}> {/* Centered submit button */}
              <Button
                label="Submit Diagnosis"
                type="submit"
                primary
                margin={{ top: 'medium' }} // Added margin for space
              />
            </Box>
          </Form>
        </Box>
      </Grommet>
    );
  }
}

export default Diagnose;
