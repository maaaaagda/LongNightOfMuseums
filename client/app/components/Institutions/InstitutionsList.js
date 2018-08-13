import React from 'react';
import { connect } from 'react-redux';
import {load_institutions, delete_institution} from "../../store/actions/institutionActions";
import {Card, Image, Grid, Button, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import CustomModal from "../Helpers/Modals";

class Institutions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormLoading: false,
      modal: ''
    };
    this.hideModal = this.hideModal.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(load_institutions())
      .then((res) => {
        console.log(res)
      });
  }
  ensureDeletingInstitution(id) {
    let confirmModal = (
      <CustomModal
        modalType='confirm'
        header='Remove institution'
        content='Are you sure you want to delete chosen institution?'
        hideModal={this.hideModal}
        performAction={() => {this.deleteInstitution(id)}}
      />
    );
    this.showModal(confirmModal);
  }
  showModal(modal) {
    this.setState({ modal: modal });
  }
  hideModal() {
    this.setState({ modal: '' })
  }

  deleteInstitution(id) {
    this.props.dispatch(delete_institution(id))
      .then(() => {
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='Institution deleted successfully.'
            hideModal={this.hideModal}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={err.response.data.message || 'Something went wrong, unable to delete selected institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  renderInstitutionsList() {
    let resultList = [];
    this.props.institutions.map((institution, index) => {
      let result = (
        <Card fluid key={index}>
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column tablet={7} computer={5} only='computer tablet'>
                <Image src={require('../../assets/footer_picture_2.jpg')} size={'huge'}/>
              </Grid.Column>
              <Grid.Column mobile={11} tablet={6} computer={7}>
                <Card.Content>
                  <Card.Header>
                    <h2>{institution.name}</h2>
                  </Card.Header>
                  <Card.Meta>
                    <span>{institution.address}</span>
                  </Card.Meta>
                  <br/>
                  <Card.Description>
                    <a>{institution.website}</a>
                  </Card.Description>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={5} tablet={3} computer={4}>
                <div className='vertical-center-outer'>
                  <Button basic color='red' onClick={this.ensureDeletingInstitution.bind(this, institution._id)}> Delete </Button>
                  <br/>
                  <Button basic color='black' as={Link} to={`/institutions/${institution._id}`}> Edit </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
      );
      resultList.push(result);
    });
    return resultList;
  }
  render() {
    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y'>
          <Segment.Group horizontal>
            <Segment textAlign='left'><h1> List of all institutions </h1></Segment>
            <Segment textAlign='right' as={Link} to={"/institutions/new"}>
              <Button color='black'>
                Add new institution
              </Button>
            </Segment>
          </Segment.Group>
          {this.renderInstitutionsList()}
          {this.state.modal}
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
