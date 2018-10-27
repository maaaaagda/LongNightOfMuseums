import React from 'react';
import {connect} from 'react-redux';
import {Menu, Grid, Dimmer, Loader, Segment, Button} from 'semantic-ui-react'

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activeRoute: ''
        };
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.renderMenuItems = this.renderMenuItems.bind(this);
        this.renderRouteList = this.renderRouteList.bind(this);
    }
    componentDidUpdate() {
      if(!this.state.activeRoute && this.props.routes && this.props.routes.length > 0) {
        this.setState({activeRoute: this.props.routes[0]._id})
      }
    }
    handleRouteChange (e, { value }) {
      this.setState({ activeRoute: value })
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
    renderRouteList() {
      if(!this.state.activeRoute && this.props.routes && this.props.routes.length > 0) {
        this.setState({activeRoute: this.props.routes[0]._id})
      }
      let currentRoute =  this.props.routes.find(route => {
        return route._id === this.state.activeRoute
      });
      if (currentRoute && this.props.institutions.length > 0) {
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
            <Button basic color='red'>Delete</Button>
            <Button basic color='blue'>View route</Button>
          </div>
        </div>
      } else {
        return <div className='jumbotron-fully-centered'>
          <Dimmer active inverted>
            <Loader inverted>Loading...</Loader>
          </Dimmer>
        </div>
      }
    }
    render() {
      return (
        <div className='jumbotron-padding-small'>
          <h1>My saved routes</h1>
          <br/>
          {this.props.routes ?
            <Grid>
              <Grid.Column width={4}>
                <Menu pointing secondary vertical fluid>
                  {this.renderMenuItems()}
                </Menu>
              </Grid.Column>
              <Grid.Column width={12}>
                {this.renderRouteList()}
              </Grid.Column>
            </Grid>
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
