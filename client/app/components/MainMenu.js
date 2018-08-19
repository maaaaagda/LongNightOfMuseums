import React, { Component } from 'react'
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {logOutSuccess} from "../store/actions/loginActions";
import history from "../helpers/history";

class MainMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeItem: '1',
      visibleSideBar: false,
      visibleTitle: false
    };
    this.handleLogout = this.handleLogout.bind(this);
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

  render() {
    const activeItem = this.state.activeItem;

    return (
      <div>
        <Menu borderless={true} fixed={'top'}>
          <Menu.Item name='1' active={activeItem === '1'}  onClick={this.handleButtonClick} >
            <Icon name='sidebar' size="big" inverted/>
          </Menu.Item>
        </Menu>
        {this.props.isLoggedIn ? (
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
              <Menu.Item as={Link} to="/institutions" onClick={this.handleButtonClick}>
                Institutions
              </Menu.Item>
              <Menu.Item as='div' onClick={this.handleButtonClick}>
                My routes
              </Menu.Item>
              <Menu.Item as='div' onClick={this.handleButtonClick}>
                Map
              </Menu.Item>
              <Menu.Item as='div' onClick={this.handleButtonClick}>
                Info
              </Menu.Item>
              <Menu.Item as='div' onClick={this.handleLogout}>
                Logout
              </Menu.Item>
              <Menu.Item as={Link} to={"/cities"} onClick={this.handleButtonClick}>
                Cities
              </Menu.Item>
              <Menu.Item as={Link} to={"/admins"} onClick={this.handleButtonClick}>
                Administrators
              </Menu.Item>
            </Sidebar>
        ):
          (
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
              <Menu.Item as={Link} to='#' onClick={this.handleButtonClick}>
                My routes
              </Menu.Item>
              <Menu.Item as={Link} to='#' onClick={this.handleButtonClick}>
                Map
              </Menu.Item>
              <Menu.Item as={Link} to='#' onClick={this.handleButtonClick}>
                Info
              </Menu.Item>
              <Menu.Item as={Link} to={"/login"} onClick={this.handleButtonClick}>
                Login
              </Menu.Item>
            </Sidebar>
          )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return  {
    isLoggedIn: state.admin.isLoggedIn
  }
}

export default connect(mapStateToProps)(MainMenu);
