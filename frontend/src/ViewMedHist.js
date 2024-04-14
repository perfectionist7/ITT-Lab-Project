import React, { Component} from 'react';

import {
    Box,
    Button,
    Heading,
    Grommet,
    FormField,
    Form
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
export class ViewMedHist extends Component {
    
    state = { medhiststate: [] }

    componentDidMount() {
        this.getNames("");
        console.log(this.state.names);
    }

    getNames(value) {
        let patName = " ";
        if (value !== undefined)
            patName = value;
        console.log(patName);
        fetch('http://localhost:3001/MedHistView?name='+ patName + '&variable=words')
        .then(res => res.json())
        .then(res => this.setState({ medhiststate: res.data }));
    }

    render() {
        const { medhiststate } = this.state;

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
          <a style={{ color: "#ffffff", textDecoration: 'inherit' }} href="/"><Heading level='3' margin='none'>HealthHub - <i> Hospital Management Portal </i></Heading></a>
        </AppBar>

            </Box>
        );

        const Body = () => (
            <div className="container" style={{width:"100vw"}}>
                <div className="panel panel-default p50 uth-panel">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th style={{width:"50vw", textAlign:"center"}}>Name</th>
                                <th style={{width:"50vw",textAlign:"center"}}>Profile</th>
                            </tr>
                        </thead> 
                        <tbody>
                            {medhiststate.map(patient =>
                                <tr key={patient.id} style={{textAlign:"center"}}>
                                    <td>{patient.Name} </td>
                                    <td>
                                        <Button label="Medical Profile" href={'/ViewOneHistory/' + patient.email}/>
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
                <Box fill={true} align="center" style={{ backgroundImage: 'url("https://t3.ftcdn.net/jpg/02/16/47/22/360_F_216472247_cT66WDoS0fp1s3wC7eaykMJNDGVbOBPq.jpg")', backgroundSize: 'cover' }}>
                <Box width="high" pad="medium" background={{ color: 'rgba(255, 255, 255, 0.8)' }} round="small" elevation="medium"> 
                    <Form
                        onSubmit={({ value }) => {
                            this.getNames(value.email);
                        }}>
                          
                        <h4 style={{textAlign:"center", marginBottom:"0px"}}>Search By Name</h4>
                        <FormField name="email" align="center"style={{ marginBottom:"30px"}} />
                        <div align="center">
                            <Button type="submit" primary label="Submit" style={{ marginBottom:"20px"}}/>
                        </div>
                    </Form>
                
                    <Body />
                    </Box>
                </Box>
            </Grommet>
        );
    }
}

export default ViewMedHist;