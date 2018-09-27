import React from 'react';
import {connect} from 'react-redux';
import { Menu, Grid } from 'semantic-ui-react'

class Routes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activeRoute: 'home',
          routes: []
        };
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.renderMenuItems = this.renderMenuItems.bind(this);
        this.renderRouteList = this.renderRouteList.bind(this);
    }
    componentDidMount() {
      let routes = localStorage.getItem('sightseeingPath');
      if(routes) {
        try {
          let parsedRoutes = JSON.parse(routes);
          this.setState({routes: parsedRoutes, activeRoute: parsedRoutes[0].routeName});

        } catch (e) {

        }
      }
    }

    handleRouteChange (e, { name }) {
      this.setState({ activeRoute: name })
    }
    renderMenuItems() {
      return this.state.routes.map((route, index) => {
        return <Menu.Item
          key={index}
          name={route.routeName}
          active={this.state.activeRoute === route.routeName}
          onClick={this.handleRouteChange}
        />
      })
    }
    renderRouteList() {
      let currentRoute =  this.state.routes.find(route => {
        return route.routeName === this.state.activeRoute
      });
      if(currentRoute) {
        return currentRoute.routeInstitutions.map(inst => {
          return <div>{inst}</div>
        })
      }
    }
    render() {
      return (
        <div className='jumbotron-padding-small'>
          <Grid>
            <Grid.Column width={4}>
              <Menu pointing secondary vertical>
                {this.renderMenuItems()}
              </Menu>

            </Grid.Column>

            <Grid.Column stretched width={12}>
                {this.renderRouteList()}
            </Grid.Column>
          </Grid>
        </div>
      )
    }


}

function mapStateToProps(state) {
    return {
        state: state
    }
}

export default connect(mapStateToProps)(Routes);
