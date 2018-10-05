import React, { Component } from 'react'
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {logOutSuccess} from "../store/actions/loginActions";
import history from "../helpers/history";
import {withRouter} from 'react-router-dom';

class MainMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeItem: '1',
      visibleSideBar: false,
      visibleTitle: false
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.scrollToComponent = this.scrollToComponent.bind(this);
  }

  handleButtonClick = () => this.setState({ visibleSideBar: !this.state.visibleSideBar });
  handleSidebarHide = () => this.setState({ visibleSideBar: false });

  componentDidMount () {
    this.setState({visibleTitle: true});
  }

  handleLogout () {
    this.props.dispatch(logOutSuccess());
    this.setState({ visibleSideBar: !this.state.visibleSideBar });
    history.push('/');
  }
  scrollToComponent(component) {
    if(this.props.location.pathname !== '/') {
      this.setState({ visibleSideBar: false });
      history.push({pathname: '/', state: {scrollToComponent: component}});
    } else {
      this.setState({ visibleSideBar: false });
      let topPosOfDiv = document.getElementById(component).getBoundingClientRect().top;
      window.scrollBy({top: topPosOfDiv - 70, behavior: 'smooth'});
    }

  }

  render() {
    const activeItem = this.state.activeItem;

    return (
      <div>
        <Menu borderless={true} fixed={'top'}>
          <Menu.Item name='1' active={activeItem === '1'}  onClick={this.handleButtonClick} >
            <Icon name='sidebar' size="big" inverted/>
          </Menu.Item>
        </Menu>
            <Sidebar
              as={Menu}
              fixed="left"
              animation='overlay'
              inverted
              onHide={this.handleSidebarHide}
              vertical
              visible={this.state.visibleSideBar}
              width='wide'
            >
              <Menu.Item as={Link} to="/"  onClick={this.handleButtonClick}>
                Home
              </Menu.Item>
              <Menu.Item as={Link} to={this.props.isLoggedIn? "/admin/institutions" : "/institutions"} onClick={this.handleButtonClick}>
                Institutions
              </Menu.Item>
              <Menu.Item as='a' onClick={() => this.scrollToComponent('my-routes')}>
                My routes
              </Menu.Item>
              <Menu.Item as='a' onClick={() => this.scrollToComponent('map')}>
                Map
              </Menu.Item>
              <Menu.Item as='a' onClick={() => this.scrollToComponent('footer')}>
                Info
              </Menu.Item>
              {this.props.isLoggedIn ? (
                  <span>
                    <Menu.Item as={Link} to={"/admin/cities"} onClick={this.handleButtonClick}>
                      Cities
                    </Menu.Item>
                    <Menu.Item as={Link} to={"/admin/admins"} onClick={this.handleButtonClick}>
                      Administrators
                    </Menu.Item>
                    <Menu.Item as={Link} to={"#"} onClick={this.handleLogout}>
                      Logout
                    </Menu.Item>
                </span>
                )
                : <Menu.Item as={Link} to="/login"  onClick={this.handleButtonClick}>
                  Login
                </Menu.Item>
              }
            </Sidebar>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return  {
    isLoggedIn: state.admin.isLoggedIn
  }
}

export default withRouter(connect(mapStateToProps)(MainMenu));
