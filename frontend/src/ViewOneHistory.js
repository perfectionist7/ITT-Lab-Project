import React, { Component} from 'react';

import {
    Box,
    Heading,
    Grommet,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Text
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
      background='#36454f'
      pad={{ left: 'medium', right: 'small', vertical: 'small' }}
      style={{ zIndex: '1' }}
      {...props} />
  );

export class ViewOneHistory extends Component {
    state = { medhiststate: [], medhiststate2: []}
    componentDidMount() {
        const { email } = this.props.match.params;
        // this.allDiagnoses(email);
        this.getHistory(email);
    }

    getHistory(value) {
        let email = "'" + value + "'";
        fetch('http://localhost:3001/OneHistory?patientEmail='+ email)
        .then(res => res.json())
            .then(res => this.setState({ medhiststate: res.data }));
    }

    // allDiagnoses(value) {
    //     let email = "'" + value + "'";
    //     fetch('http://localhost:3001/allDiagnoses?patientEmail='+ email)
    //     .then(res => res.json())
    //     .then(res => this.setState({ medhiststate2: res.data }));
    // }

    render() {
        const { medhiststate } = this.state;
        // const { medhiststate2 } = this.state;
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
            style={{borderBottom:"1px solid grey" }}
          >
        <AppBar>
          <a style={{ color: "#ffffff", textDecoration: 'inherit' }} href="/"><Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal </i></Heading></a>
        </AppBar>
            </Box>
        );
        const Body = () => (
            
            <div className="container" >
                   <Box pad="medium" background={{ color: 'rgba(255, 255, 255, 0.8)' }} round="small" elevation="medium">
                <div className="panel panel-default p50 uth-panel">
                <div style={{ margin: '30px' }}></div>  
                <Text style={{ fontSize: '24px', color: '#36454f', marginLeft: '30px' }}> <b>  Medical History:  </b> </Text>
                    {medhiststate.map(patient =>
                        <Table>
                                                                                    <div style={{ margin: '30px' }}></div>  
                                                        <div style={{ marginLeft: '20px' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell scope="row">
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i> Patient's Name: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f' }}>   {patient.name} </label>
                                    </TableCell>
                                    <TableCell />
                                    <TableCell> 
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i> Gender: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.gender} </label></TableCell> 
                                    
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i> Email ID: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.email} </label></TableCell> 
                                    <TableCell />
                                    <TableCell>
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i> Address: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.address} </label></TableCell> 
                                </TableRow>
                                <TableRow>
                                    <TableCell scope="row">
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i>  Conditions: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.conditions} </label></TableCell> 
                                        <TableCell />
                                        <TableCell>
                                        <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i>  Surgeries: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.surgeries} </label></TableCell> 
                                </TableRow>

                                <TableRow>
                                    <TableCell scope="row">
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                    <label style={{ fontSize: '18px', color: '#36454f' }}> <b> <i>  Medications: </i></b> </label>
                                    </TableCell>
                                    <TableCell> <label style={{ fontSize: '18px', color: '#36454f'}}>   {patient.medication} </label></TableCell> 
                                    <TableCell />
                                </TableRow>
                            </TableBody>
                            </div>
                            <div style={{ margin: '20px' }}></div>  
                        </Table>
                    )}
                </div>
                </Box>
                <hr />
            </div>
        );
        // const Body2 = () => (
        //     <div className="container">
        //         <div className="panel panel-default p50 uth-panel">
        //             {medhiststate2.map(patient =>
        //                 <div>
        //                 <Table>
        //                     <TableBody>
        //                         <TableRow>
        //                             <TableCell scope="row">
        //                                 <strong>Date</strong>
        //                             </TableCell>
        //                             <TableCell>{patient.date.split('T')[0]}</TableCell>
        //                             <TableCell></TableCell>
        //                             <TableCell><strong>Doctor</strong></TableCell>
        //                             <TableCell>{patient.doctor}</TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell scope="row">
        //                                 <strong>Concerns</strong>
        //                             </TableCell>
        //                             <TableCell>
        //                                 {patient.concerns}
        //                             </TableCell>
        //                             <TableCell />
        //                             <TableCell>
        //                                 <strong>Symptoms</strong>
        //                             </TableCell>
        //                             <TableCell>{patient.symptoms}</TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell scope="row">
        //                             </TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell>
        //                                 <strong>Diagnosis</strong>
        //                             </TableCell>
        //                             <TableCell>{patient.diagnosis}
        //                                 </TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell scope="row">
        //                             </TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell>
        //                                 <strong>Prescription</strong>
        //                             </TableCell>
        //                             <TableCell>{patient.prescription}
        //                             </TableCell>
        //                         </TableRow>
        //                         <TableRow>
        //                             <TableCell scope="row">
        //                             </TableCell>
        //                         </TableRow>
        //                     </TableBody>
        //                 </Table>
        //                 <hr />
        //                 </div>
        //             )}
        //         </div>
        //     </div>
        // );
        return (
            <Grommet full={true} theme={theme}>
                <Box fill={true}    style={{ backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/16/47/22/360_F_216472247_cT66WDoS0fp1s3wC7eaykMJNDGVbOBPq.jpg")', backgroundSize: 'cover' }}>
                    <Header />
                    <Body />
                    {/* <Body2 /> */}
                </Box>
            </Grommet>
        );
    }
}
export default ViewOneHistory;