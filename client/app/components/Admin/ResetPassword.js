import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Input, Message, Modal, Segment, Transition} from "semantic-ui-react";
import {ValidationForm, ValidationInput} from "./FormElementsWithValidation";
import {password, required, min_length} from "./FormValidationRules";
import {login} from "../../store/actions/loginActions";
//import {reset_password} from "../../store/actions/resetPasswordActions";
import history from '../../helpers/history'

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      passwordRepeat: '',
      opened_modal: false,
      isFormLoading: false,
      isError: false,
      passwordMinLength: 7
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  handleChange (e){
    this.setState({
      isError: false,
      [e.target.name]: e.target.value
    })
  }
  handleSubmit (e) {
    e.preventDefault();
    this.form.validateAll();
    if(this.isFormValid(this.form)) {
      //this.resetPassword()
    }
  };

  resetPassword() {
    this.setState({isFormLoading: true});
    this.props.dispatch(reset_password({email: this.state.email}))
      .then(() => {
        this.setState({isFormLoading: false, opened_modal: true})
      })
      .catch(() => {
        this.setState({isFormLoading: false, isError: true})
      })
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

  showModal() {
    this.setState({ opened_modal: true })
  }
  hideModal() {
    this.setState({ opened_modal: false })
  }
  redirectToHomepage () {
    history.push('/');
  }
  render() {
    return (
      <div className={'jumbotron-top-small'}>
        <Segment textAlign='center'>
          <h1>Reset my password</h1>
        </Segment>
        <br/>
        <div className={'login'}>
          <ValidationForm
            size='large'
            loading={this.state.isFormLoading}
            ref={form => { this.form = form }}>
            <ValidationInput
              id='form-input-password'
              name='password'
              control={Input}
              label='Password'
              type='password'
              minLen={this.state.passwordMinLength}
              onChange={this.handleChange}
              value={this.state.password}
              validations={[required, min_length]}
            />
            <ValidationInput
              id='form-input-password-repeat'
              name='password-repeat'
              control={Input}
              label='Repeat password'
              type='password'
              minLen={this.state.passwordMinLength}
              onChange={this.handleChange}
              value={this.state.passwordRepeat}
              validations={[required, password, min_length]}
            />
            <div className='text-center'>
              <Form.Field
                id='form-button-control-public'
                control={Button}
                secondary
                content='Send'
                onClick={this.handleSubmit}
              />
            </div>
          </ValidationForm>
          <br/>
          <br/>
          <Transition visible={this.state.isError} animation='fade' duration={500}>
            <Message
              size={'small'}
              error
              header='Reseting password failed'
              content='Something went wrong.'
            />
          </Transition>
          <Modal size='small' open={this.state.opened_modal} onClose={this.hideModal}>
            <Modal.Header>Password reset</Modal.Header>
            <Modal.Content>
              <p>Password was successfully changed.</p>
            </Modal.Content>
            <Modal.Actions>
              <Button onClick={this.redirectToHomepage.bind(this)} color='black'>Go to login page</Button>
            </Modal.Actions>
          </Modal>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    state: state
  }
}

export default connect(mapStateToProps)(ResetPassword);
