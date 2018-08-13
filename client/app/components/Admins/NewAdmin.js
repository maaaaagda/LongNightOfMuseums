import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Segment} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {create_admin} from "../../store/actions/adminActions";
import history from '../../helpers/history';
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required, email} from '../Helpers/FormValidationRules';
import CustomModal from '../Helpers/Modals';

class NewAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isFormLoading: false,
          modal: '',
          name: '',
          last_name: '',
          email: '',
          address: ''
        };
      this.submitForm = this.submitForm.bind(this);
      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
      this.hideModalSuccess = this.hideModalSuccess.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.ensureSavingAdmin = this.ensureSavingAdmin.bind(this)
    }

    submitForm() {
      this.setState({isFormLoading: true});
      let admin_data = {
        name: this.state.name,
        last_name: this.state.last_name,
        email: this.state.email,
        address: this.state.address
      };
       this.props.dispatch(create_admin(admin_data))
        .then(() => {
          this.setState({isFormLoading: false});
          let successModal = (
            <CustomModal
              modalType='simple'
              header='Operation completed successfully'
              content='New administrator created successfully. Message containing first steps in the application were sent on user email.'
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
            content={err.response.data.message || 'Something went wrong, unable to create new administrator'}
            hideModal={this.hideModal}
          />);
          this.showModal(errorModal);
        })
    }
    ensureSavingAdmin(e) {
      e.preventDefault();
      this.form.validateAll();
      if(this.isFormValid(this.form)) {
        let customModal = (
          <CustomModal
            modalType='confirm'
            header='New administrator'
            content='Are you sure you want to create new administrator?'
            hideModal={this.hideModal}
            performAction={this.submitForm}
          />
        );
        this.showModal(customModal);
      }
    }

    isFormValid(form) {
      let isFormValid = true;
      let form_elems = form.state.byId;
      Object.keys(form_elems).forEach(i => {
        if (form_elems[i].error) {
          isFormValid = false;
        }});
      return isFormValid;
    }

    showModal(modal) {
      this.setState({ modal: modal });
    }
    hideModal() {
      this.setState({ modal: '' })
    }
    hideModalSuccess () {
      this.setState({ modal: '' });
      history.push('/admins');
    }
    handleChange (e){
      this.setState({
        [e.target.name]: e.target.value
      })
    }

    render() {
        return (
          <div className='jumbotron-top-small'>
            <Segment.Group horizontal>
              <Segment textAlign='left'><h1> New administrator </h1></Segment>
              <Segment textAlign='right' as={Link} to={"/admins"}>
                <Button color='black'>
                  Go back
                </Button>
              </Segment>
            </Segment.Group>
            <br/>
            <ValidationForm
              ref={form => { this.form = form }}
              loading={this.state.isFormLoading}>
              <Form.Group widths='equal'>
                <ValidationInput
                  id='form-input-first-name'
                  name='name'
                  control={Input}
                  label='First name'
                  required
                  onChange={this.handleChange}
                  value={this.state.name}
                  validations={[required]}
                />
                <ValidationInput
                  id='form-input-last-name'
                  name='last_name'
                  control={Input}
                  label='Last name'
                  required
                  onChange={this.handleChange}
                  value={this.state.last_name}
                  validations={[required]}
                />
              </Form.Group>
              <Form.Group widths='equal'>
                <ValidationInput
                  id='form-input-email'
                  name='email'
                  control={Input}
                  label='Email'
                  required
                  onChange={this.handleChange}
                  value={this.state.email}
                  validations={[required, email]}
                />
                <ValidationInput
                  id='form-input-address'
                  name='address'
                  control={Input}
                  label='Address'
                  onChange={this.handleChange}
                  value={this.state.address}
                />
              </Form.Group>
              <div className='text-center'>
                <Form.Field
                  id='form-button-control-public'
                  control={Button}
                  content='Confirm'
                  secondary
                  onClick={this.ensureSavingAdmin}
                />
              </div>
            </ValidationForm>
            {this.state.modal}
          </div>

        )
    }


}

function mapStateToProps()
{
    return {}
}

export default connect(mapStateToProps)(NewAdmin);
