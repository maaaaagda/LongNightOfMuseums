import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {Button, Grid, Icon, Segment} from "semantic-ui-react";
import MapContainer from "../Map/Map";


class Route extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          routeId: '',
          routeInstitutions: ["5b6dbd54c466fc0f8c87b71c","5b6a0134107ebd15195e4fe9"],
          routeName: 'Wroclove route',
          allRouteInstitutions: []
        };
        this.renderRouteInstitutions = this.renderRouteInstitutions.bind(this);
        this.setRouteInstitutions = this.setRouteInstitutions.bind(this);

    }
  componentDidMount() {
    this.setState({routeId: this.props.match.params.routeId}, () => {
      this.setRouteInstitutions();
    });
  }
  componentDidUpdate() {
      console.log('did up');
      if(this.props.institutions.length > 0 && this.state.allRouteInstitutions.length === 0) {
        console.log('in');
        this.setRouteInstitutions();
      }
  }
  setRouteInstitutions() {
    let allRouteInstitutions = [];
    this.state.routeInstitutions.forEach(instId => {
      let institution = this.props.institutions.find(propInst => {
        return propInst._id === instId
      });
      if (institution) {
        institution.checked = true;
        allRouteInstitutions.push(institution);
      }
    });
    this.setState({allRouteInstitutions});
  }
  renderRouteInstitutions() {
    let formattedRoutes =  this.state.allRouteInstitutions.map((institution, index) => {
      return <Segment key={index}>
          <h3>{index + 1}. {institution.name} </h3>
          {institution.city.name}, {institution.address}
        </Segment>
    });
    return <div>
      {formattedRoutes}
    </div>
  }
    render() {
        return (
          <div className={'main-container jumbotron-padding-small'}>
            <Grid>
              <Grid.Row>
                <div>
                  <Link to={"/"}>
                    <Button
                      icon
                      labelPosition='left'
                      secondary
                      floated='left'
                    >
                      Go to my routes
                      <Icon name='left arrow'/>
                    </Button>
                  </Link>
                </div>
              </Grid.Row>
              <Grid.Row>
                  <div className='title padding-bottom-small w-100'>
                    Route {this.state.routeName}
                  </div>
                  Route id: {this.state.routeId}
              </Grid.Row>
              <Grid.Row>
                 <Grid.Column largeScreen={8} widescreen={8} mobile={16}>
                    <div className='w-100'>
                      {this.renderRouteInstitutions()}
                    </div>
                   <br/>
                  </Grid.Column>
                  <Grid.Column largeScreen={8} widescreen={8} mobile={16}>
                    <div className={'map w-100'} id='map'>
                      <MapContainer
                        allInstitutions={this.state.allRouteInstitutions}
                      />
                    </div>
                  </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )
    }


}

function mapStateToProps(state) {
    return {
        institutions: state.institutions
    }
}

export default connect(mapStateToProps)(Route);
