import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Button, Segment, Modal} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import {create_admin} from "../../store/actions/adminActions";
import history from '../../helpers/history';

class NewAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          opened_modal: false,
          name: '',
          last_name: '',
          email: '',
          address: ''
        };
      this.submitForm = this.submitForm.bind(this);
      this.showModal = this.showModal.bind(this);
      this.hideModal = this.hideModal.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.ensureSavingAdmin = this.ensureSavingAdmin.bind(this)
    }

    submitForm() {
      let admin_data = {
        name: this.state.name,
        last_name: this.state.last_name,
        email: this.state.email,
        address: this.state.address,
        password: 'pass'
      };
      this.props.dispatch(create_admin(admin_data))
        .then(() => {
          history.push('/admins')
        })
    }
    ensureSavingAdmin() {
      this.showModal()
    }

    showModal() {
      this.setState({ opened_modal: true })
    }
    hideModal() {
      this.setState({ opened_modal: false })
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
            <Form size='large' onSubmit={this.ensureSavingAdmin}>
              <Form.Group widths='equal'>
                <Form.Field
                  id='form-input-first-name'
                  name='name'
                  control={Input}
                  label='First name'
                  required
                  onChange={this.handleChange}
                  value={this.state.name}
                />
                <Form.Field
                  id='form-input-last-name'
                  name='last_name'
                  control={Input}
                  label='Last name'
                  required
                  onChange={this.handleChange}
                  value={this.state.last_name}
                />
              </Form.Group>
              <Form.Group widths='equal'>
                <Form.Field
                  id='form-input-email'
                  name='email'
                  control={Input}
                  label='Email'
                  required
                  onChange={this.handleChange}
                  value={this.state.email}
                />
                <Form.Field
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
                />
              </div>
            </Form>
            <Modal size='small' open={this.state.opened_modal} onClose={this.hideModal}>
              <Modal.Header>New administrator</Modal.Header>
              <Modal.Content>
                <p>Are you sure you want to create new administrator?</p>
              </Modal.Content>
              <Modal.Actions>
                <Button color='black' onClick={this.hideModal}>No</Button>
                <Button color='green' inverted onClick={this.submitForm}>Yes</Button>
              </Modal.Actions>
            </Modal>
          </div>

        )
    }


}

function mapStateToProps()
{
    return {}
}

export default connect(mapStateToProps)(NewAdmin);
