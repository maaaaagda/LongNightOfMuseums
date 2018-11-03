import React from 'react';
import {Button, Icon, Segment, Grid} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {
  load_institution,
  update_institution
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
      isFormLoading: true,
      institutionId: ''
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
        .catch((err) => {
          let errorModal = (
            <CustomModal
              modalType='simple'
              header='Fetching data failed'
              content={(err.response && err.response.data && err.response.data.message)?
                err.response.data.message
                : 'Something went wrong, unable to fetch institution data'}
              hideModal={this.hideModal}
            />);
          this.showModal(errorModal);
          this.setState({isFormLoading: false})
        });
    });
  }

  submitForm() {
    this.setState({isFormLoading: true});
    this.props.dispatch(update_institution(this.state.institutionId, this.state.institutionData))
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
  submitSaving(institutionData) {
    let customModal = (
      <CustomModal
        modalType='confirm'
        header='Update institution'
        content='Are you sure you want to update this institution?'
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
        <Grid>
          <Grid.Row>
            <div className='jumbotron-padding-small'>
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
          <Grid.Row>
            <div className='jumbotron-top-small institution-form'>
              <Segment textAlign='center'><h1> Edit institution </h1></Segment>
              <br/>
              <InstitutionForm
                submitSaving={this.submitSaving}
                institutionData={this.state.institutionData}
                isFormLoading={this.state.isFormLoading}
              />
              {this.state.modal}
            </div>
          </Grid.Row>
        </Grid>
      </div>

    )
  }
}


export default connect(null)(EditInstitution);
