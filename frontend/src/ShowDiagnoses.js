import React, { Component } from 'react';
import TextToSpeech from './TexttoSpeech'; // Import the TextToSpeech component
import styled from 'styled-components'; // Import styled-components
import {
  Box,
  Heading,
  Grommet,
  Table,
  TableBody,
  TableCell,
  TableRow
} from 'grommet';

const theme = {
  global: {
    colors: {
      brand: '#36454f',
      focus: "#ffffff"
    },
    font: {
      family: 'Lato',
    },
  },
};
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px; /* Add margin from the left side */
  margin-bottom: 30px; /* Adjust the margin bottom to reduce the distance between containers */
  margin-left: 50px; /* Add margin from the left side */
  margin-right: 1100px; /* Add margin from the left side */
`;
class ShowDiagnoses extends Component {
  constructor(props) {
    super(props);
    this.state = { diagnoses: [] };
    this.id = props.match.params.id;
  }

  componentDidMount() {
    fetch('http://localhost:3001/showDiagnoses?id=' + this.id)
      .then(res => res.json())
      .then(res => this.setState({ diagnoses: res.data }));
  }

  render() {
    const { diagnoses } = this.state;
  
    return (
      <Grommet full={true} theme={theme}  style={{ backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/16/47/22/360_F_216472247_cT66WDoS0fp1s3wC7eaykMJNDGVbOBPq.jpg")', backgroundSize: 'cover' }}>
        <Box fill={true}>
          <Box
            tag='header'
            direction='row'
            align='center'
            justify='between'
            background='#36454f'
            pad={{ left: 'medium', right: 'small', vertical: 'small' }}
            style={{ zIndex: '1' }}>
            <Box>
              <a style={{ color: "#ffffff", textDecoration: "#ffffff"}} href="/">
                <Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal</i></Heading>
              </a>
            </Box>
          </Box>
          
          <div className="container" style={{ marginTop: "20px"}}>
            <div className="panel panel-default p50 uth-panel">
              
              {diagnoses.map(diagnosis => (
                <div key={diagnosis.id}>
                     <Box width="high" pad="medium" background={{ color: 'rgba(255, 255, 255, 0.8)' }} round="small" elevation="medium">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell scope="row">
                          <strong>Appointment Id</strong>
                        </TableCell>
                        <TableCell>{diagnosis.id}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <br />
                      <TableRow>
                        <TableCell scope="row">
                          <strong>Doctor</strong>
                        </TableCell>
                        <TableCell>{diagnosis.email}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <br />
                      <TableRow>
                        <TableCell scope="row">
                          <strong>Diagnosis</strong>
                        </TableCell>
                        <TableCell>{diagnosis.diagnosis}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <br />
                      <TableRow>
                        <TableCell scope="row">
                          <strong>Prescription</strong>
                        </TableCell>
                        <TableCell>{diagnosis.prescription}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  </Box>
                  <ButtonContainer>
                    <TextToSpeech textToSpeak={diagnosis.diagnosis} buttonText="Read Diagnosis" />
                    <TextToSpeech textToSpeak={diagnosis.prescription} buttonText="Read Prescription" />
                  </ButtonContainer>
                  

                </div>
              ))}
            </div>
            <hr />
          </div>
        </Box>
      </Grommet>
    );
  }
}

export default ShowDiagnoses;
