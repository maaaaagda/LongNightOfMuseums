import React from 'react';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {Button, Form, Container, Message, Transition, Segment} from 'semantic-ui-react';
import { login } from '../../store/actions/loginActions';
import history from "../../helpers/history";

class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: '',
      password: '',
      isFormLoading: false,
      isUserLoggedIn: this.props.admin.isLoggedIn,
      isButtonSubmitDisabled: true,
      isLoginError: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value,
      isButtonSubmitDisabled: this.state.email === "" || this.state.password === "",
      isLoginError: false
    })
  }
  handleSubmit () {
    this.setState({isFormLoading: true});
    let loginData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.dispatch(login(loginData))
      .then(() => {
        this.setState({isFormLoading: false}, () => {
          history.push('/admin/institutions')
        })
      })
      .catch(() => {
        this.setState({isFormLoading: false, isLoginError: true})
      })

  };
  render() {
    return (
      <div className={'jumbotron-top-small'}>
        <Segment textAlign='center'>
          <h1>Login</h1>
        </Segment>
        <br/>
        <div className={'login'}>
          <Form
            size='large'
            loading={this.state.isFormLoading}
            onSubmit={this.handleSubmit}
            error={this.state.isLoginError}>
            <Form.Field>
              <label>Email/Login</label>
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
              <Button secondary type='submit' disabled={this.state.isButtonSubmitDisabled}>Submit</Button>
            </Container>
            <br/>
            <br/>
            <Container textAlign={'center'}>
              <Link to={'/remindpassword'}>
                Remind me password
              </Link>
            </Container>
            <br/>
            <Transition visible={this.state.isLoginError} animation='fade' duration={500}>
              <Message
                size={'small'}
                error
                header='Login failed'
                content='Wrong e-mail address or password'
              />
            </Transition>

          </Form>
        </div>
      </div>
    )
  }


}

function mapStateToProps(state){
  return {
    admin: state.admin
  }
}

export default connect(mapStateToProps)(Login);
