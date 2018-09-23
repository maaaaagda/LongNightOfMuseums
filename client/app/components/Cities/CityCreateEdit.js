import React from 'react'
import {Button, Form, Header, Modal} from 'semantic-ui-react'
import PropTypes from "prop-types";
import connect from "react-redux/es/connect/connect";
import {check_city_name} from "../../store/actions/cityActions";
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {latitude, longitude, required} from "../Helpers/FormValidationRules";

class CityCreateEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: false,
      cityName: this.props.cityData ? this.props.cityData.name : '',
      longitude: this.props.cityData ? this.props.cityData.longitude : '',
      latitude: this.props.cityData ? this.props.cityData.latitude : '',
      cityId:this.props.cityData ? this.props.cityData._id : '',
      originalCityName: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({originalCityName: this.props.cityData ? this.props.cityData.name : ''})
  }
  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value
    });
    if(e.target.name === 'cityName' && (e.target.value !== this.state.originalCityName || this.state.originalCityName === '')) {
      this.props.dispatch(check_city_name(e.target.value.trim()))
        .then(() => {
          this.setState({isError: false});
          this.form.validate('cityName');
        })
        .catch(() => {
          this.form.validate('cityName');
          this.setState({isError: true})
        })
    } else {
      this.setState({isError: false})
    }
  }

  cityNameExists = () => {
    if(this.state.isError) {
      return 'City with given name already exists.'
    }
  };

  isFormValid(form) {
    let isFormValid = true;
    let form_elems = form.state.byId;
    Object.keys(form_elems).forEach(i => {
      if (form_elems[i].error) {
        isFormValid = false;
      }
    });
    return isFormValid;
  }
  onFormSubmit(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.isFormValid(this.form) && !this.state.isError) {
      let cityData = {
        name: this.state.cityName,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      this.props.handleSubmit(cityData, this.state.cityId)
    }
  }

  render() {
    return (
      <Modal open={true} onClose={this.props.hideModal} size='small'>
        <Modal.Content>
          <Modal.Description>
            <Header>{this.props.headerName}</Header>
            <ValidationForm
              ref={form => {
                this.form = form
              }}>
              <ValidationInput
                  name='cityName'
                  ref={input => { this.cityName = input }}
                  id='form-input-city'
                  label='City name'
                  value={this.state.cityName}
                  required
                  validations={[required, this.cityNameExists ]}
                  onChange={this.handleChange}
              />
              <ValidationInput
                id='form-input-latitude'
                name='latitude'
                label='Latitude'
                onChange={this.handleChange}
                value={this.state.latitude}
                required
                validations={[required, latitude]}
              />
              <ValidationInput
                id='form-input-longitude'
                name='longitude'
                label='Longitude'
                onChange={this.handleChange}
                value={this.state.longitude}
                required
                validations={[required, longitude]}
              />
            </ValidationForm>
          </Modal.Description>
        </Modal.Content>
          <Modal.Actions>
            <Button color='black' onClick={this.props.hideModal}>Cancel</Button>
            <Button
              color='green'
              inverted
              onClick={this.onFormSubmit}
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
