import React from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, Container } from 'semantic-ui-react';
import { login } from '../../store/actions/loginActions'

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleLoginButton = this.handleLoginButton.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e){
    this.setState({[e.target.name]: e.target.value})
  }
  handleLoginButton () {
    let loginData = {
      email: this.state.email,
      password: this.state.password
    }
    this.props.dispatch(login(loginData))

  };
  render() {
    return (
      <div className={'jumbotron'}>
        <div className={'login'}>
          <Form size={'big'}>
            <Form.Field>
              <label>Email</label>
              <input
                value={this.state.email}
                name="email"
                id={"admin_email"}
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Password</label>
              <input
                type='password'
                value={this.state.password}
                name="password"
                id={"admin_password"}
                onChange={this.handleChange}/>
            </Form.Field>
            <Container textAlign={'center'}>
              <Button secondary type='submit' onClick={this.handleLoginButton}>Submit</Button>
            </Container>
          </Form>
        </div>
      </div>
    )
  }


}

function mapStateToProps(state){
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Login);
