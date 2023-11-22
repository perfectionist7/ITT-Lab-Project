import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Button
} from 'grommet';

import './App.css';

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

export class PatientsViewAppointments extends Component {
    state = { appointmentsState: [] }
    componentDidMount() {
        this.getNames("");
    }
    getNames(value) {
        let patName = value;
        console.log(patName);
        fetch("http://localhost:3001/userInSession")
            .then(res => res.json())
            .then(res => {
                var string_json = JSON.stringify(res);
                var email_json = JSON.parse(string_json);
                let email_in_use = email_json.email;
                fetch('http://localhost:3001/patientViewAppt?email=' + email_in_use)
                    .then(res => res.json())
                    .then(res => {
                        this.setState({ appointmentsState: res.data });
                    });
            });
    }
    render() {
        const { appointmentsState } = this.state;
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                            <th style={{ padding: '20px' }}>Date of Appointment</th>
                            <th style={{ padding: '20px' }}>Start Time</th>
                            <th style={{ padding: '20px' }}>End Time</th>
                            <th style={{ padding: '20px' }}>Concerns</th>
                            <th style={{ padding: '20px' }}>Symptoms</th>
                            <th style={{ padding: '30px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsState.map(patient =>
                                <tr key={patient.user}>
                                    <td align="center" >
                                        {new Date(patient.theDate).toLocaleDateString().substring(0, 10)}
                                    </td>
                                    <td align="center" >{patient.theStart.substring(0, 5)}</td>
                                    <td align="center" >{patient.theEnd.substring(0, 5)}</td>
                                    <td align="center" style={{ paddingRight: '20px' }}>{patient.theConcerns} </td>
                                    <td align="center">{patient.theSymptoms}</td>
                                    <td align="center" style={{ paddingRight: '15px' }}>{patient.status}</td>
                                    <td style={{ paddingRight: '20px' }}>
                                        <Button label="See Diagnosis"
                                        href={`/showDiagnoses/${patient.ID}`}
                                        ></Button>     
                                    </td> 
                                    <td>
                                    {   patient.status==="NotDone"?
                                        <Button label="Cancel"
                                        onClick = {() => {
                                            fetch('http://localhost:3001/deleteAppt?uid='+ patient.ID)
                                            window.location.reload()
                                        }}
                                        ></Button>
                                        :
                                        <Button label="Delete"
                                        onClick = {() => {
                                            fetch('http://localhost:3001/deleteAppt?uid='+ patient.ID)
                                            window.location.reload()
                                        }}
                                        ></Button>
                                    }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
        return (
            <Grommet theme={theme} full>
                <Box >
                    <AppBar>
                    <a style={{ color: "#ffffff", textDecoration: "#ffffff"}} href="/"><Heading level='3' margin='none'>MediCarePro - <i> Your Health, Our Priority</i></Heading></a>
                    </AppBar>
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default PatientsViewAppointments;