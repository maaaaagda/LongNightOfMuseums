import {Container, Icon, Transition} from "semantic-ui-react";
import React from "react";
import InstitutionsOverview from '../Institutions/InstitutionsOverview';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleTitle: false
    };
    this.seeMore = this.seeMore.bind(this);
  }
  seeMore() {
    let topPosOfDiv = document.getElementById('institutions-overview').getBoundingClientRect().top;
    window.scrollBy({top: topPosOfDiv - 70, behavior: 'smooth'});
  }
  componentDidMount () {
    this.setState({visibleTitle: true});
  }

  render() {
    return (
      <div>
        <div id='home-container' className='container-black'>
          <div className={'jumbotron'}>
            <Transition visible={this.state.visibleTitle} animation='scale' duration={5000}>
              <Container textAlign={'center'}>
                <h1 className={'app-title'}>Long Night Of Museums</h1>
                <h1><Icon inverted name='university' size={'huge'}/></h1>
              </Container>
            </Transition>
          </div>
          <div className='see-more' onClick={this.seeMore}>
              <div className="arrow arrow-bottom arrow-up"/>
              <div className="arrow arrow-bottom arrow-down"/>
          </div>
        </div>
        <div id='institutions-overview'>
          <InstitutionsOverview/>
        </div>
      </div>
    )
  }
}

export default Home;
