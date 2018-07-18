import React, { Component } from 'react'
import {Container, Sidebar, Menu, Icon, Transition, Header} from "semantic-ui-react";

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
          <Menu.Item inverted={'true'}>
              Menu
              <Icon link name={'close'} onClick={this.handleButtonClick}/>
          </Menu.Item>
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
          <Sidebar.Pusher>
              <div className={'main-container'}>
                <div className={'jumbotron'}>
                     <Transition visible={this.state.visibleTitle} animation='scale' duration={5000}>
                        <Container textAlign={'center'}>
                          <h1 className={'title'}>Long Night Of Museums</h1>
                          <h1><Icon name='university' size={'huge'}/></h1>
                        </Container>
                      </Transition>
              </div>
                </div>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}
