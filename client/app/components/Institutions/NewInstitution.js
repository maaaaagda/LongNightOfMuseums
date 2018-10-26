import React from 'react';
import { connect } from 'react-redux';
import {Button, Icon, Segment, Grid} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {create_institution} from "../../store/actions/institutionActions";
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
    this.props.dispatch(create_institution(this.state.institutionData))
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
            content={(err.response && err.response.data && err.response.data.message)?
              err.response.data.message
              : 'Something went wrong, unable to create new institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })

  }
  submitSaving(institutionData) {
    let customModal = (
      <CustomModal
        modalType='confirm'
        header='New institution'
        content='Are you sure you want to create new institution?'
        hideModal={this.hideModal}
        performAction={this.submitForm}
      />
    );
    this.setState({institutionData: institutionData}, () => {
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
      history.push('/admin/institutions');
    });
  }

  render() {
    return (
      <div>
        <div className={'jumbotron-padding-small'}>
          <Grid.Row>
            <div>
              <Link to={"/admin/institutions"}>
                <Button
                  icon
                  labelPosition='left'
                  secondary
                  floated='left'
                >
                  Go back to all institutions
                  <Icon name='left arrow'/>
                </Button>
              </Link>
            </div>
          </Grid.Row>
        </div>
      <div className='jumbotron-top-small'>
        <Segment textAlign='center'><h1> New institution </h1></Segment>
        <br/>
        <InstitutionForm
          submitSaving={this.submitSaving}
          institutionData={this.state.institutionData}
          isFormLoading={this.state.isFormLoading}
        />
        {this.state.modal}
      </div>
      </div>
    )
  }
}


export default connect(null)(NewInstitution);
