import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Segment, Icon, Grid} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {create_admin, edit_admin, load_admin} from "../../store/actions/adminActions";
import history from '../../helpers/history';
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required, email} from '../Helpers/FormValidationRules';
import CustomModal from '../Helpers/Modals';
import moment from "moment";

class EditAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormLoading: false,
      modal: '',
      name: '',
      last_name: '',
      email: '',
      address: '',
      role: '',
      created_at: ''
    };
    this.submitForm = this.submitForm.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.hideModalSuccess = this.hideModalSuccess.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.ensureSavingAdmin = this.ensureSavingAdmin.bind(this)
  }
  componentDidMount() {
    this.setState({isFormLoading: true});
    this.props.dispatch(load_admin(this.props.match.params.adminId))
      .then((admin) => {
        if(admin) {
          this.setState({
            name: admin.name,
            last_name: admin.last_name,
            email: admin.email,
            role: admin.role,
            created_at: admin.created_at,
            address: admin.address,
            isFormLoading: false
          })
        }
      })
      .catch(() => {
        this.setState({isFormLoading: false})
      })
  }
  submitForm() {
    this.setState({isFormLoading: true});
    let admin_data = {
      name: this.state.name,
      last_name: this.state.last_name,
      address: this.state.address,
      role: this.state.role
    };
    this.props.dispatch(edit_admin(this.props.match.params.adminId, admin_data))
      .then(() => {
        this.setState({isFormLoading: false});
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='Administrator edited successfully.'
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
              : 'Something went wrong, unable to edit administrator'}
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
          header='Edit administrator'
          content='Are you sure you want to edit the administrator?'
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
    history.push('/admin/admins');
  }
  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  formatDate(date){
    return moment(date, moment.ISO_8601).format("DD.MM.YYYY  HH:mm")
  }

  render() {
    return (
      <div>
        <div className={'jumbotron-padding-small'}>
          <Grid.Row>
            <div>
              <Link to={"/admin/admins"}>
                <Button
                  icon
                  labelPosition='left'
                  secondary
                  floated='left'
                >
                  Go back to all administrators
                  <Icon name='left arrow'/>
                </Button>
              </Link>
            </div>
          </Grid.Row>
        </div>
        <div className='jumbotron-top-small'>
          <Segment textAlign='center'><h1> Edit administrator </h1></Segment>
          <br/>
          <ValidationForm
            ref={form => { this.form = form }}
            loading={this.state.isFormLoading}>
            <Form.Group widths='equal'>
              <div className='field'>
                <label>Email</label>
                <div className='user-input'>
                  {this.state.email}
                </div>
              </div>
              <div className='field'>
                <label>Account created</label>
                <div className='user-input'>
                  {this.formatDate(this.state.created_at)}
                </div>
              </div>
            </Form.Group>
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
                id='form-input-role'
                name='role'
                control={Input}
                label='Role'
                onChange={this.handleChange}
                value={this.state.role}
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
                content='Edit'
                secondary
                onClick={this.ensureSavingAdmin}
              />
            </div>
          </ValidationForm>
          {this.state.modal}
        </div>
      </div>
    )
  }


}

function mapStateToProps(state)
{
  return {
    admins: state.admins
  }
}

export default connect(mapStateToProps)(EditAdmin);
