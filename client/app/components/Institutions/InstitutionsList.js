import React from 'react';
import { connect } from 'react-redux';
import * as institutionActions from '../../store/actions/institutionActions';

class Institutions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      institution: {
        title: 'Museum'
      }
    };
    this.onClickSave = this.onClickSave.bind(this);
  }
  onClickSave() {
    this.props.dispatch(institutionActions.createInstitution(this.state.institution))
  }

  institutionRow(institution, index) {
    return <h2 key={index}>{institution.title}</h2>
  }

  render() {
    return (
      <div>
        <button onClick={this.onClickSave}>
          Save institution
        </button>
        {this.props.institutions.map(this.institutionRow)}
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    institutions: state.institutions
  }
}

export default connect(mapStateToProps)(Institutions);
