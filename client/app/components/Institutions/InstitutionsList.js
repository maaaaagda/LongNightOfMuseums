import React from 'react';
import { connect } from 'react-redux';
import {load_institutions, create_institution} from "../../store/actions/institutionActions";
import { Card, Icon, Image, Grid, Button} from 'semantic-ui-react';

class Institutions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {
        name: 'Museum'
      }
    };
    this.onClickSave = this.onClickSave.bind(this);
  }
  componentDidMount() {
    this.props.dispatch(load_institutions());
  }

  onClickSave() {
    this.props.dispatch(create_institution(this.state.institution))
  }

  institutionRow(institution, index) {
    let result = (
      <Card fluid key={index}>
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={5}>
              <Image src={require('../../assets/footer_picture_2.jpg')} size={'huge'}/>
            </Grid.Column>
            <Grid.Column width={11}>
              <Card.Content>
                <Card.Header>
                  <h2>{institution.name}</h2>
                </Card.Header>
                <Card.Meta>
                  <span>{institution.address}</span>
                </Card.Meta>
                <br/>
                <Card.Description className='institution-card-content'>
                  <a>{institution.website}</a>
                  </Card.Description>
                <Card.Meta textAlign='center'>
                  <Button> Show more </Button>
                  <Button> Edit </Button>
                </Card.Meta>
              </Card.Content>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card>
    );
    return result;
  }

  render() {
    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y'>
          {/*<button onClick={this.onClickSave}>*/}
            {/*Save institution*/}
          {/*</button>*/}
          <div className='text-center'>
            <h1>All institutions</h1>
          </div>
          {this.props.institutions.map(this.institutionRow)}
        </div>
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    institutions: state.institutions
  }
}

export default connect(mapStateToProps)(Institutions);
