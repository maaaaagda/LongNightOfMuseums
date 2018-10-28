import React from 'react';
import {connect} from 'react-redux';
import {Link} from "react-router-dom";
import {Button, Dimmer, Grid, Icon, Loader, Segment} from "semantic-ui-react";
import MapContainer from "../Map/Map";
import {get_single_route_from_database} from "../../store/actions/routeActions";
import history from "../../helpers/history";


class Route extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          routeId: '',
          routeInstitutions: [],
          routeName: '',
          allRouteInstitutions: [],
          loading: true,
          error: false
        };
        this.renderRouteInstitutions = this.renderRouteInstitutions.bind(this);
        this.setRouteInstitutions = this.setRouteInstitutions.bind(this);

    }
  componentDidMount() {
    this.setState({routeId: '5bd596173690eb0adb9caf0f'}, () => {
      this.props.dispatch(get_single_route_from_database(this.state.routeId))
        .then((res) => {
          if(res && res.length > 0){
            let route = res[0];
            if(route) {
              this.setState({routeInstitutions: route.institutions, routeName: route.name, loading: false}, () => {
                this.setRouteInstitutions();
              })
            } else {
              this.setState({loading: false, error: true})
            }

          } else {
            this.setState({loading: false, error: true});
            console.log('did not found route')
          }
        })
        .catch(() => {
          this.setState({loading: false, error: true})
        });

    });
  }
  componentDidUpdate() {
      if(this.props.institutions.length > 0 && this.state.routeInstitutions.length > 0  && this.state.allRouteInstitutions.length === 0) {
        this.setRouteInstitutions();
      }
  }
  setRouteInstitutions() {
    let allRouteInstitutions = [];
    let institutions = JSON.parse(JSON.stringify(this.props.institutions));
    this.state.routeInstitutions.forEach(instId => {
      let institution = institutions.find(propInst => {
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

  goBackToAllRoutes() {
    history.push({pathname: '/', state: {scrollToComponent: 'my-routes'}});
  }

  render() {
    return (
      <div className={'main-container jumbotron-padding-small'}>
        <Grid>
          <Grid.Row>
            <div>
              <Button
                  icon
                  labelPosition='left'
                  secondary
                  floated='left'
                  onClick={this.goBackToAllRoutes}
                >
                  Go to my routes
                  <Icon name='left arrow'/>
                </Button>
            </div>
          </Grid.Row>
        </Grid>
        {this.state.loading ? (
          <div className='w-100'>
            <div className='jumbotron-fully-centered'>
              <Dimmer active inverted>
                <Loader inverted>Loading...</Loader>
              </Dimmer>
            </div>
          </div>
        ) : this.state.error ? (
          <div className='jumbotron'>
            <div className='text-center'>
              <h1>Sorry, we could not find this route</h1>
            </div>
          </div>
        ) : (
          <Grid>
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
                  {/*<MapContainer*/}
                    {/*allInstitutions={this.state.allRouteInstitutions}*/}
                  {/*/>*/}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
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
