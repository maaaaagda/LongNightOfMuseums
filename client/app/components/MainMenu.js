import React, { Component } from 'react'
import { Sidebar, Menu, Icon } from "semantic-ui-react";
import { Link } from 'react-router-dom';

export default class MenuExampleBorderless extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeItem: '1',
      visibleSideBar: false,
      visibleTitle: false
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });
  handleButtonClick = () => this.setState({ visibleSideBar: !this.state.visibleSideBar });
  handleSidebarHide = () => this.setState({ visibleSideBar: false });

  componentDidMount () {
    this.setState({visibleTitle: true});
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
          <Menu.Item as={Link} to={"/login"} onClick={this.handleButtonClick}>
            Login
          </Menu.Item>
          <Menu.Item as={Link} to={"/counter"} onClick={this.handleButtonClick}>
            Counter
          </Menu.Item>
        </Sidebar>
      </div>
    )
  }
}
