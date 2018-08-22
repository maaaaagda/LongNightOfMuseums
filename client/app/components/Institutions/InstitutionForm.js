import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Icon, Select, TextArea} from "semantic-ui-react";
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required} from "../Helpers/FormValidationRules";
import PropTypes from "prop-types";
import ImageUploader from 'react-images-upload';

class InstitutionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFormLoading: this.props.isFormLoading,
      name: this.props.institutionData.name || '',
      description: this.props.institutionData.description || '',
      website: this.props.institutionData.website || '',
      address: this.props.institutionData.address || '',
      latitude: this.props.institutionData.latitude || '',
      longitude: this.props.institutionData.longitude || '',
      city: this.props.institutionData.city_id || '',
      photos: [],
      cities: [],
      visitingPlan: this.props.institutionData.visitingPlan || '',
      currentStep: 1,
      buttonPreviousDisabled: true,
      buttonNextSave: ''
    };
    this.ensureSavingInstitution = this.ensureSavingInstitution.bind(this);
    this.goToTheNextStep = this.goToTheNextStep.bind(this);
    this.goToThePreviousStep = this.goToThePreviousStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
  }

  componentDidMount() {
    let buttonNext = (
      <Button
        icon labelPosition='right'
        secondary
        floated='right'
        onClick={this.goToTheNextStep}
      >
        Next
        <Icon name='right arrow' />
      </Button>
    );
    this.setState({buttonNextSave: buttonNext, cities: this.manageCitiesList(this.props.cities)})
  }
  componentWillReceiveProps(nextProps) {
      this.setState({
        isFormLoading: nextProps.isFormLoading,
        name: nextProps.institutionData.name || '',
        description: nextProps.institutionData.description || '',
        website: nextProps.institutionData.website || '',
        address: nextProps.institutionData.address || '',
        city: nextProps.institutionData.city_id,
        latitude: nextProps.institutionData.latitude || '',
        longitude: nextProps.institutionData.longitude || '',
        visitingPlan: nextProps.institutionData.visiting_plan || ''
      }, () => {
        this.setState({cities: this.manageCitiesList(nextProps.cities)})
      });
    }
  manageCitiesList(cities) {
    let citiesSelect = [];
    cities.map(city => {
      let result = {
        key: city._id,
        text: city.name,
        value: city._id
      };
      citiesSelect.push(result);
    });
    if(!this.state.city) {
      let city = citiesSelect.length > 0 ? citiesSelect[0].value : '';
      this.setState({city: city});
    }
    return citiesSelect;
  }
  ensureSavingInstitution(e) {
    console.log(e.target.files);
     e.preventDefault();
    // this.form.validateAll();
    // if (this.isFormValid(this.form)) {
    //   let institution_data = {
    //     name: this.state.name,
    //     website: this.state.website,
    //     city_id: this.state.city,
    //     address: this.state.address,
    //     description: this.state.description,
    //     visiting_plan: this.state.visitingPlan,
    //     latitude: this.state.latitude,
    //     longitude: this.state.longitude,
    //     photos: this.state.photos
    //   };
    let formData = new FormData();

    formData.append('description', 'heelloo');
    this.state.photos.forEach(photo => {
      formData.append('selectedFile', photo);
    });
    this.props.submitSaving(formData);
  }

  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleCitySelectChange (e, {name, value}){
    this.setState({
      [name]: value
    })
  }
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

  onDrop(picture) {
    this.setState({
      photos: this.state.photos.concat(picture),
    });
  }
  renderGeneralInfoStep() {
    return (
      <div>
        <ValidationInput
          id='form-input-first-name'
          name='name'
          label='Name'
          required
          onChange={this.handleChange}
          value={this.state.name}
          validations={[required]}
        />
        <Form.Group widths='equal'>
          <ValidationInput
            id='form-input-website'
            name='website'
            label='Website'
            onChange={this.handleChange}
            value={this.state.website}
          />
          <Form.Field
            id='form-input-city'
            name='city'
            control={Select}
            label='City'
            onChange={this.handleCitySelectChange}
            options={this.state.cities}
            value={this.state.city}
          />
        </Form.Group>
        <ValidationInput
          id='form-input-address'
          name='address'
          label='Address'
          onChange={this.handleChange}
          value={this.state.address}
          required
          validations={[required]}
        />
        <Form.Group widths='equal'>
          <ValidationInput
            id='form-input-latitude'
            name='latitude'
            label='Latitude'
            required
            onChange={this.handleChange}
            value={this.state.latitude}
            validations={[required]}
          />
          <ValidationInput
            id='form-input-longitude'
            name='longitude'
            label='Longitude'
            onChange={this.handleChange}
            value={this.state.longitude}
            required
            validations={[required]}
          />
        </Form.Group>
      </div>
    )
  }

  renderDescriptionStep() {
    return (
      <Form.Field
        id='form-input-description'
        name='description'
        control={TextArea}
        label='Description'
        rows={15}
        onChange={this.handleChange}
        value={this.state.description}
      />
    )
  }

  renderVisitingPlanStep() {
    return (
      <Form.Field
        id='form-input-visiting-plan'
        name='visitingPlan'
        control={TextArea}
        label='Visiting plan'
        rows={15}
        onChange={this.handleChange}
        value={this.state.visitingPlan}
      />
    )
  }
  renderPhotosStep() {
    return <ImageUploader
      withIcon={true}
      withPreview={true}
      buttonText='Choose images'
      name='selectedFile'
      onChange={this.onDrop}
      imgExtension={['.jpg', '.gif', '.png', '.gif']}
      maxFileSize={5242880}
    />
  }
  renderFormStep() {
    let step = 1;
    switch (this.state.currentStep) {
      case 1:
        step = this.renderPhotosStep(); //this.renderGeneralInfoStep();
        break;
      case 2:
        step = this.renderDescriptionStep();
        break;
      case 3:
        step = this.renderVisitingPlanStep();
        break;
    }
    return step;
  }

  goToTheNextStep(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.isFormValid(this.form)) {
      this.setState({
        currentStep: this.state.currentStep + 1
      }, () => {
        this.handleCurrentStepChange();
      })
    }
  }

  goToThePreviousStep(e) {
    e.preventDefault();
    this.setState({currentStep: this.state.currentStep - 1}, () => {
      this.handleCurrentStepChange();
    })
  }

  handleCurrentStepChange() {
    if (this.state.currentStep !== 3) {
      let buttonNext = (
        <Button
          icon labelPosition='right'
          secondary
          floated='right'
          onClick={this.goToTheNextStep}
        >
          Next
          <Icon name='right arrow'/>
        </Button>
      );
      this.setState({
        buttonNextSave: buttonNext,
        buttonPreviousDisabled: this.state.currentStep === 1
      })
    } else {
      let buttonSave = (
        <Button
          icon labelPosition='right'
          secondary
          floated='right'
          onClick={this.ensureSavingInstitution}
        >
          Save
          <Icon name='check' inverted/>
        </Button>
      );
      this.setState({buttonNextSave: buttonSave})
    }

  }

  render() {
    return (
    <div>

      <form onSubmit={this.ensureSavingInstitution}>
        {this.renderFormStep()}
        <button type="submit">Submit</button>
      </form>
      </div>
    )
  }


}

InstitutionForm.propTypes = {
  submitSaving: PropTypes.func,
  institutionData: PropTypes.object,
  isFormLoading: PropTypes.bool
};


function mapStateToProps(state) {
    return {
        cities: state.cities
    }
}

export default connect(mapStateToProps)(InstitutionForm);
