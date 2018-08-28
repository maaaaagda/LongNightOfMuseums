import React from 'react';
import {Button, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {
  delete_institution_photos,
  load_institution,
  update_institution,
  upload_institution_photos
} from "../../store/actions/institutionActions";
import history from '../../helpers/history';
import CustomModal from '../Helpers/Modals';
import { connect } from 'react-redux';
import InstitutionForm from './InstitutionForm';

class EditInstitution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: '',
      institutionData: {},
      institutionPhotos:[],
      isFormLoading: true,
      institutionId: '',
      photosIdsToDelete: []
    };
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hideModalSuccess = this.hideModalSuccess.bind(this);
    this.submitSaving = this.submitSaving.bind(this);
  }

  componentDidMount() {
    this.setState({institutionId: this.props.match.params.institutionId}, () => {
      this.props.dispatch(load_institution(this.state.institutionId))
        .then((res) => {
          this.setState({institutionData: res.data, isFormLoading: false})
        })
        .catch(() => {
          let errorModal = (
            <CustomModal
              modalType='simple'
              header='Fetching data failed'
              content={err.response.data.message || 'Something went wrong, unable to fetch institution data'}
              hideModal={this.hideModal}
            />);
          this.showModal(errorModal);
          this.setState({isFormLoading: false})
        });
    });

  }

  getPhotosToDelete(newPhotos) {
    let photosIdsToDelete = this.state.institutionData.photos
      .filter(photo => {
      return !newPhotos.includes(photo.id)
    }).map(photo => {
      return photo.id
      });
    this.setState({photosIdsToDelete});
  }

  submitForm() {
    this.setState({isFormLoading: true});
    Promise.all([this.props.dispatch(upload_institution_photos(this.state.institutionPhotos)),
      this.props.dispatch(delete_institution_photos(this.state.photosIdsToDelete))])
      .then((res) => {
        let institutionData = Object.assign({}, this.state.institutionData);
        institutionData.photos = [...this.state.institutionData.photos, ...res[0].data];
        return this.props.dispatch(update_institution(this.state.institutionId, institutionData))
      })
     .then(() => {
        this.setState({isFormLoading: false});
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='Institution updated successfully.'
            hideModal={this.hideModalSuccess}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        this.setState({isFormLoading: false});
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={(err.response && err.response.data && err.response.data.message)?
              err.response.data.message
              : 'Something went wrong, unable to update institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  submitSaving(institutionPhotos, institutionData) {
    let customModal = (
      <CustomModal
        modalType='confirm'
        header='Update institution'
        content='Are you sure you want to update this institution?'
        hideModal={this.hideModal}
        performAction={this.submitForm}
      />
    );
    this.getPhotosToDelete(institutionData.photos);
    this.setState({institutionData: institutionData, institutionPhotos: institutionPhotos}, () => {
      this.showModal(customModal);
    });
  }

  showModal(modal) {
    this.setState({ modal: modal });
  }
  hideModal() {
    this.setState({ modal: '' })
  }
  hideModalSuccess () {
    this.setState({ modal: '' }, () => {
      history.push('/institutions');
    });
  }

  render() {
    return (
      <div className='jumbotron-top-small'>
        <Segment.Group horizontal>
          <Segment textAlign='left'><h1> Edit institution </h1></Segment>
          <Segment textAlign='right' as={Link} to={"/institutions"}>
            <Button color='black'>
              Go back to all institutions
            </Button>
          </Segment>
        </Segment.Group>
        <br/>
        <InstitutionForm
          submitSaving={this.submitSaving}
          institutionData={this.state.institutionData}
          isFormLoading={this.state.isFormLoading}
        />
        {this.state.modal}
      </div>

    )
  }
}


export default connect(null)(EditInstitution);
