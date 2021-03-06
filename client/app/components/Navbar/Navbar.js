import React, { Component } from 'react'
import { Button, Header, Icon, Image, Menu, Segment, Sidebar, Container } from 'semantic-ui-react'

export default class SidebarExampleSidebar extends Component {
  state = { visible: false }

  handleButtonClick = () => this.setState({ visible: !this.state.visible })

  handleSidebarHide = () => this.setState({ visible: false })

  render() {
    const { visible } = this.state

    return (
      <div>
        <Button onClick={this.handleButtonClick}>Toggle visilhhhhhhity</Button>

        <Sidebar.Pushable as={Container}>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={visible}
            width='thin'
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
      </div>
    )
  }
}
