import React from 'react'
import {Button, Form, Header, Modal} from 'semantic-ui-react'
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";

class CityCreateEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonSaveDisabled: true,
      isError: false,
      cityName: this.props.cityName || '',
      cityId: this.props.cityId || ''
    };
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value,
      buttonSaveDisabled: e.target.value === '' || e.target.value === this.props.cityName
    })
  }

  render() {
    return (
      <Modal open={true} onClose={this.props.hideModal} size='small'>
        <Modal.Content>
          <Modal.Description>
            <Header>{this.props.headerName}</Header>
            <Form>
              <Form.Field>
                <label>City name</label>
                <input
                  name="cityName"
                  id={"cityName"}
                  value={this.state.cityName}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
            {this.state.isError ? (
              <div className="error">City with given name already exists.</div>
            ) : ""}

          </Modal.Description>
        </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.props.hideModal}>Cancel</Button>
            <Button
              color='green'
              inverted
              disabled={this.state.buttonSaveDisabled}
              onClick={() => {this.props.handleSubmit(this.state.cityName, this.state.cityId)}}
            >
              Save
            </Button>
          </Modal.Actions>
      </Modal>
    )
  }
}
CityCreateEdit.propTypes = {
  handleSubmit: PropTypes.func,
  headerName: PropTypes.string,
  cityName: PropTypes.string,
  cityId: PropTypes.string
};

export default connect(null)(CityCreateEdit)
