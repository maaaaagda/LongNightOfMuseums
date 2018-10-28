import React from 'react';
import {connect} from 'react-redux';
import {Menu, Grid, Dimmer, Loader, Segment, Button} from 'semantic-ui-react'
import history from "../../helpers/history";
import {delete_route} from "../../store/actions/routeActions";

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activeRoute: '',
          loading: false
        };
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.renderMenuItems = this.renderMenuItems.bind(this);
        this.renderRouteList = this.renderRouteList.bind(this);
        this.viewRouteDetails = this.viewRouteDetails.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);
    }
    componentDidUpdate() {
      if(!this.state.activeRoute && this.props.routes && this.props.routes.length > 0) {
        this.setState({activeRoute: this.props.routes[0]._id})
      }
    }
    handleRouteChange (e, { value }) {
      this.setState({ activeRoute: value })
    }

    deleteRoute() {
      this.setState({loading: true});
      this.props.dispatch(delete_route(this.state.activeRoute))
        .then(() => {
          if(this.props.routes && this.props.routes.length > 0) {
            let routesCopy = JSON.parse(JSON.stringify(this.props.routes.map(route => route._id)));
            localStorage.setItem('sightseeingPath', JSON.stringify(routesCopy));
            this.setState({activeRoute: this.props.routes[0]._id, loading: false})
          } else {
            localStorage.removeItem('sightseeingPath');
          }
        })
        .catch((err) => {
          this.setState({loading: false});
          console.log(err);
        });
    }
    renderMenuItems() {
      return this.props.routes.map((route, index) => {
        return <Menu.Item
          key={index}
          name={route.name}
          value={route._id}
          active={this.state.activeRoute === route._id}
          onClick={this.handleRouteChange}
        />
      })
    }
    renderRouteList(currentRoute) {
        let formattedRoutes =  currentRoute.institutions.map((instId, index) => {
          let institution = this.props.institutions.find(propInst => {
            return propInst._id === instId
          });
          if (institution) {
            return <Segment key={index}>
              <h3>{index + 1}. {institution.name} </h3>
              {institution.city.name}, {institution.address}
            </Segment>
          }
        });

        return <div>
          {formattedRoutes}
          <div className='text-center'>
            <Button basic color='red' onClick={this.deleteRoute}>Delete</Button>
            <Button basic color='blue' onClick={this.viewRouteDetails}>View route</Button>
          </div>
        </div>
    }
    viewRouteDetails() {
      history.push(`/routes/${this.state.activeRoute}`);
    }
    renderRoutes() {
      if(!this.state.activeRoute && this.props.routes && this.props.routes.length > 0) {
        this.setState({activeRoute: this.props.routes[0]._id})
      }
      let currentRoute =  this.props.routes.find(route => {
        return route._id === this.state.activeRoute
      });
      if (currentRoute && this.props.institutions.length > 0 && !this.state.loading) {
        return <Grid>
          <Grid.Column width={4}>
            <Menu pointing secondary vertical fluid>
              {this.renderMenuItems()}
            </Menu>
          </Grid.Column>
          <Grid.Column width={12}>
            {this.renderRouteList(currentRoute)}
          </Grid.Column>
        </Grid>
      } else {
        return (
        <Grid>
          <Grid.Column width={16}>
            <div className='jumbotron-fully-centered'>
              <Dimmer active inverted>
                <Loader inverted>Loading...</Loader>
              </Dimmer>
            </div>
          </Grid.Column>
        </Grid>
        )
      }
    }

    render() {
      return (
        <div className='jumbotron-padding-small'>
          <h1>My saved routes</h1>
          <br/>
          {this.props.routes ?
            <div>{this.renderRoutes()}</div>
            : <div>
              <p>
              It's empty in here... You don't have any saved routes. Select institutions from list above and click 'Save path'
              to create one.
              </p>
            </div>}
        </div>
      )
    }
}

function mapStateToProps(state) {
    return {
      institutions: state.institutions,
      routes: state.routes
    }
}

export default connect(mapStateToProps)(Routes);
