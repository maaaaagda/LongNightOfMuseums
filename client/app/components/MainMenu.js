import React, { Component } from 'react'
import SideBar from './Navbar/Navbar'
import {Container, Sidebar, Menu, Icon} from "semantic-ui-react";

export default class MenuExampleBorderless extends Component {
  state = { activeItem: '1', visible: false  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleButtonClick = () => this.setState({ visible: !this.state.visible })
  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const activeItem = this.state.activeItem
    const visible = this.state.visible

    return (
      <>
        <Sidebar.Pushable as={Container}>
          <Menu borderless>
            <Menu.Item name='1' active={activeItem === '1'}  onClick={this.handleButtonClick} >
              <Icon name='sidebar'/>
            </Menu.Item>
          </Menu>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width='wide'
          >
            <Menu.Item as='a'>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='gamepad' />
              Games
            </Menu.Item>
            <Menu.Item as='a'>
              <Icon name='camera' />
              Channels
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher >
            <>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
              <div>bwhfuhi</div>
            </>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </>
    )
  }
}
