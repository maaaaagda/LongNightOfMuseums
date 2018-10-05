import {Container, Icon, Transition} from "semantic-ui-react";
import React from "react";
import InstitutionsOverview from '../Institutions/InstitutionsOverview';
import MyRoutes from '../Routes/Routes';

class Home extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleTitle: false
    };
    this.seeMore = this.seeMore.bind(this);
  }
  componentDidUpdate(){
    if(this.props.location && this.props.location.state && this.props.location.state.scrollToComponent){
      let component = this.props.location.state.scrollToComponent;
      let topPosOfDiv = document.getElementById(component).getBoundingClientRect().top;
      window.scrollBy({top: topPosOfDiv - 70, behavior: 'smooth'});
    }
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
              <div className="arrow-see-more arrow-bottom arrow-up"/>
              <div className="arrow-see-more arrow-bottom arrow-down"/>
          </div>
        </div>
        <div id='institutions-overview'>
          <InstitutionsOverview/>
        </div>
        <div id='my-routes'>
          <MyRoutes/>
        </div>
      </div>
    )
  }
}

export default Home;
