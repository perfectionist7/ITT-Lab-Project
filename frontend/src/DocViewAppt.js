import React, { Component} from 'react';
import {
    Box,
    Button,
    Heading,
    Grommet,
} from 'grommet';

import './App.css';

const theme = {
    global: {
      colors: {
        brand: '#36454f',
        focus: '#ffffff'
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

export class DocViewAppt extends Component {
    state = { apptlist: [] }

    componentDidMount() {
        this.getNames();
    }

    getNames() {
        fetch('http://localhost:3001/doctorViewAppt')
        .then(res => res.json())
        .then(res => this.setState({ apptlist: res.data }));
    }

    render() {
        const { apptlist } = this.state;
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
        <a style={{ color: "#ffffff", textDecoration: "#ffffff"}} href="/"><Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal</i></Heading></a>
        </AppBar>
            </Box>
        );

        const Body = () => (
            
            <div className="container">
                <div style={{ margin: '20px'}}></div>
                
                <div className="panel panel-default p50 uth-panel">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{ paddingRight: '20px', paddingLeft: '30px'}}>ID</th>
                                <th style={{ paddingRight: '20px' }}>Name</th>
                                <th style={{ paddingRight: '20px' }}>Date</th>
                                <th style={{ paddingRight: '20px' }}>Start Time</th>
                                <th style={{ paddingRight: '20px' }}>Concerns</th>
                                <th style={{ paddingRight: '20px' }}>Symptoms</th>
                                <th style={{ paddingRight: '20px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apptlist.map(appt =>
                                <tr key={appt.name}>
                                    <td style={{ paddingRight: '20px', paddingLeft: '30px'}}>{appt.id}</td>
                                    <td style={{ paddingRight: '20px' }}>{appt.name}</td>
                                    <td style={{ paddingRight: '20px' }}>{new Date(appt.date).toLocaleDateString().substring(0,10)} </td>
                                    <td style={{ paddingRight: '20px' }}>{appt.starttime}</td>
                                    <td style={{ paddingRight: '20px' }}>{appt.concerns}</td>
                                    <td style={{ paddingRight: '20px' }}>{appt.symptoms}</td>
                                    <td style={{ paddingRight: '20px' }}>{appt.status}</td>
                                    <td style={{ marginLeft: '30px' }}>
                                        <Button label="Diagnose"
                                        href={`/Diagnose/${appt.id}`}
                                        ></Button>     
                                    </td> 
                                    <td>
                                        {appt.status === "NotDone"?
                                            <Button label="Cancel"
                                            onClick = {() => {
                                                fetch('http://localhost:3001/deleteAppt?uid='+ appt.id)
                                                window.location.reload();
                                            }}
                                            ></Button>
                                        :<div></div>}
                                    </td> 
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        );
        return (
            <Grommet full={true}
            theme = {theme}>
                <Header />
                <Box fill={true}>
                    <Body />
                </Box>
            </Grommet>
        );
    }
}

export default DocViewAppt;