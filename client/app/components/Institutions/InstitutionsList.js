import React from 'react';
import { connect } from 'react-redux';
import {load_institutions, delete_institution, delete_institution_photos} from "../../store/actions/institutionActions";
import {Card, Image, Grid, Button, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import CustomModal from "../Helpers/Modals";
import {Icon} from "semantic-ui-react";

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
      .then(() => {
      });
  }
  ensureDeletingInstitution(id, photos) {
    let photosIds = photos.map(photo => {
      return photo.id
    });

    let confirmModal = (
      <CustomModal
        modalType='confirm'
        header='Remove institution'
        content='Are you sure you want to delete chosen institution?'
        hideModal={this.hideModal}
        performAction={() => {this.deleteInstitution(id, photosIds)}}
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

  deleteInstitution(id, photosIds) {
    this.props.dispatch(delete_institution_photos(photosIds))
      .then(() => {
        return  this.props.dispatch(delete_institution(id));
      })
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
            content={(err.response && err.response.data && err.response.data.message)? err.response.data.message : 'Something went wrong, unable to delete selected institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  renderImage(institution) {
    let image;
    if(institution.photos.length > 0) {
      image = <Image src={"/api/institutionsphotos/" + institution.photos[0].id} size={'huge'}/>
    } else {
      image = <Icon name='university' size={'massive'}/>;
    }
    return image;
  }
  renderInstitutionsList() {
    let resultList = [];
    this.props.institutions.map((institution, index) => {
      let result = (
        <Card fluid key={index}>
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column tablet={7} computer={5} only='computer tablet'>
                  <div className={"text-center"}>
                    {this.renderImage(institution)}
                  </div>
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
                  <Button basic color='red' onClick={this.ensureDeletingInstitution.bind(this, institution._id, institution.photos)}> Delete </Button>
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
