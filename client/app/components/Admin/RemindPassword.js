import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Input, Message, Modal, Segment, Transition} from "semantic-ui-react";
import {ValidationForm, ValidationInput} from "./FormElementsWithValidation";
import {email, required} from "./FormValidationRules";
import {login} from "../../store/actions/loginActions";
import {remind_password} from "../../store/actions/remindPasswordActions";
import history from '../../helpers/history'

class RemindPassword extends React.Component {
    constructor(props) {
        super(props);
      this.state = {
        email: '',
        opened_modal: false,
        isFormLoading: false,
        isError: false
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
      this.remindPassword()
    }
  };

  remindPassword() {
    this.setState({isFormLoading: true});
    this.props.dispatch(remind_password({email: this.state.email}))
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
              <h1>Remind me password</h1>
            </Segment>
            <br/>
            <div className={'login'}>
              <ValidationForm
                size='large'
                loading={this.state.isFormLoading}
                ref={form => { this.form = form }}>
                 <ValidationInput
                    id='form-input-email'
                    name='email'
                    control={Input}
                    label='Email'
                    onChange={this.handleChange}
                    value={this.state.email}
                    validations={[required, email]}
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
                  header='Reminding password failed'
                  content='Something went wrong'
                />
              </Transition>
              <Modal size='small' open={this.state.opened_modal} onClose={this.hideModal}>
                <Modal.Header>Password reminding</Modal.Header>
                <Modal.Content>
                  <p>Password reminding instructions were sent to the given email address.
                  Be aware that it might appear in your spam folder.</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button onClick={this.redirectToHomepage.bind(this)} color='black'>Go to homepage</Button>
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

export default connect(mapStateToProps)(RemindPassword);
