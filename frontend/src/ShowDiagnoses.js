import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Table,
    TableBody,
    TableCell,
    TableRow
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

var id;
const AppBar = (props) => (
    <Box
      tag='header'
      direction='row'
      align='center'
      justify='between'
      background='#36454f'
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      style={{ zIndex: '1' }}
      {...props} />
  );
export class ShowDiagnoses extends Component {
    constructor(props) {
        super(props);
        id = props.match.params.id;
    }
    state = { diagnoses: [] }
    componentDidMount() {
        fetch('http://localhost:3001/showDiagnoses?id='+ id)
        .then(res => res.json())
        .then(res => this.setState({ diagnoses: res.data }));
    }
    render() {
        const { diagnoses } = this.state;
        const Header = () => (
            <Box
                tag='header'
                background='brand'
                pad='small'
                elevation='small'
                justify='between'
                direction='row'
                align='center'
                flex={false}
            >
        <AppBar>
        <a style={{ color: "#ffffff", textDecoration: "#ffffff"}} href="/"><Heading level='3' margin='none'>MediCarePro - <i> Your Health, Our Priority</i></Heading></a>
        </AppBar>
            </Box>
        );
        const Body = () => (
            <div className="container">
                <div className="panel panel-default p50 uth-panel">
                    {diagnoses.map(diagnosis =>
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
                    )}
                </div>
                <hr />
            </div>
        );
        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true}>
                    <Header />
                    <Body />
                </Box>
            </Grommet>
        );
    }
}
export default ShowDiagnoses;