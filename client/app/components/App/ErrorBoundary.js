import React from "react";
import {Link} from "react-router-dom";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className={'main-container'}>
          <div className='main-photo'>
            <div className='jumbotron'>
              <div className='text-center'>
                <h1 className='text-white'>We are having some technical problems at this time. Please try again later.</h1>
                <Link to='/'><h3>Go home</h3></Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
