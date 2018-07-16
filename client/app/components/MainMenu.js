import React, { Component } from 'react'
import SideBar from './Navbar/Navbar'
import {Container, Sidebar, Menu, Icon, Transition, Segment} from "semantic-ui-react";

export default class MenuExampleBorderless extends Component {
  constructor (props) {
    super(props);
    this.state = {
      activeItem: '1',
      visibleSideBar: false,
      visibleTitle: false
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  handleButtonClick = () => this.setState({ visibleSideBar: !this.state.visibleSideBar })
  handleSidebarHide = () => this.setState({ visibleSideBar: false })

  componentDidMount () {
    this.setState({visibleTitle: true});
  }
  render() {
    const activeItem = this.state.activeItem
    const visible = this.state.visible
    const visibleTitle = false;

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
          <Menu.Item as='a' onClick={this.handleButtonClick}>
            Home
          </Menu.Item>
          <Menu.Item as='a' onClick={this.handleButtonClick}>
            Institutions
          </Menu.Item>
          <Menu.Item as='a' onClick={this.handleButtonClick}>
            My routes
          </Menu.Item>
          <Menu.Item as='a' onClick={this.handleButtonClick}>
            Map
          </Menu.Item>
          <Menu.Item as='a' onClick={this.handleButtonClick}>
            Info
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pushable as={Container}>
          <Sidebar.Pusher >
            <Container textAlign='center' style={{marginTop: '100px'}}>
              <Transition visible={this.state.visibleTitle} animation='scale' duration={5000}>
                <h1 style={{color: 'white', fontSize: '50px'}}>Long Night Of Museums</h1>
                {/*<h1><Icon name='university'/></h1>*/}
              </Transition>
              <div style={{height: '1000px'}}>
              </div>
            </Container>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
