import React from 'react';
import { connect } from 'react-redux';
import {Button, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {create_institution, upload_institution_photos} from "../../store/actions/institutionActions";
import history from '../../helpers/history';
import CustomModal from '../Helpers/Modals';
import InstitutionForm from './InstitutionForm';

class NewInstitution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: '',
      institutionData: {},
      institutionPhotos: [],
      isFormLoading: false
    };
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hideModalSuccess = this.hideModalSuccess.bind(this);
    this.submitSaving = this.submitSaving.bind(this);
  }

  submitForm() {
    this.setState({isFormLoading: true});
    this.props.dispatch(upload_institution_photos(this.state.institutionPhotos))
      .then((res) => {
        let institutionData = Object.assign({}, this.state.institutionData);
        institutionData.photos = res.data;
        return this.props.dispatch(create_institution(institutionData));
      })
      .then(() => {
        this.setState({isFormLoading: false});
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='New institution created successfully.'
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
            content={(err.response && err.response.data && err.response.data.message)? err.response.data.message : 'Something went wrong, unable to create new institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })

  }
  submitSaving(institutionPhotos, institutionData) {
    let customModal = (
      <CustomModal
        modalType='confirm'
        header='New institution'
        content='Are you sure you want to create new institution?'
        hideModal={this.hideModal}
        performAction={this.submitForm}
      />
    );
    this.setState({institutionPhotos: institutionPhotos, institutionData: institutionData}, () => {
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
          <Segment textAlign='left'><h1> New institution </h1></Segment>
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


export default connect(null)(NewInstitution);
