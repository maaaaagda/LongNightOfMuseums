import {Container, Icon, Sidebar, Transition} from "semantic-ui-react";
import React from "react";

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleTitle: false
    }
  }

  componentDidMount () {
    this.setState({visibleTitle: true});
  }

  render() {
    return (
      <div className='container-black'>
          <div className={'jumbotron'}>
            <Transition visible={this.state.visibleTitle} animation='scale' duration={5000}>
              <Container textAlign={'center'}>
                <h1 className={'title'}>Long Night Of Museums</h1>
                <h1><Icon inverted name='university' size={'huge'}/></h1>
              </Container>
            </Transition>
          </div>
      </div>
    )
  }
}

export default Home;
