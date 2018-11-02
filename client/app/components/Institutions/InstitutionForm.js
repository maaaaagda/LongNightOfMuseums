import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Icon, Select, TextArea, Input, Label} from "semantic-ui-react";
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required, latitude, longitude} from "../Helpers/FormValidationRules";
import PropTypes from "prop-types";
import ImageUploader from '../ImagesUpload/UploadImages';

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
      photos: this.props.institutionData.photos || [],
      tags: this.props.institutionData.tags || [],
      currentTag: '',
      photosFiles: [],
      cities: [],
      visitingPlan: this.props.institutionData.visitingPlan || '',
      currentStep: 1,
      buttonPreviousDisabled: true,
      buttonNextSave: '',
      numberOfSteps: 4
    };
    this.ensureSavingInstitution = this.ensureSavingInstitution.bind(this);
    this.goToTheNextStep = this.goToTheNextStep.bind(this);
    this.goToThePreviousStep = this.goToThePreviousStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.deleteAlreadySavedPicture = this.deleteAlreadySavedPicture.bind(this);
    this.addTag = this.addTag.bind(this);
    this.deleteTag = this.deleteTag.bind(this);
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
    this.setState({buttonNextSave: buttonNext, cities: this.manageCitiesList(this.props.cities)});
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
        visitingPlan: nextProps.institutionData.visiting_plan || '',
        photos: nextProps.institutionData.photos || [],
        tags: nextProps.institutionData.tags || []
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
    e.preventDefault();
    this.form.validateAll();
    if (this.isFormValid(this.form)) {

      let institutionData = new FormData();
      institutionData.append('name', this.state.name);
      institutionData.append('website', this.state.website);
      institutionData.append('city_id', this.state.city);
      institutionData.append('address', this.state.address);
      institutionData.append('description', this.state.description);
      institutionData.append('visiting_plan', this.state.visitingPlan);
      institutionData.append('latitude', this.state.latitude);
      institutionData.append('longitude', this.state.longitude);
      institutionData.append('photos', JSON.stringify(this.state.photos));
      institutionData.append('tags', JSON.stringify(this.state.tags));

      this.state.photosFiles.forEach(photo => {
        institutionData.append('InstitutionPhoto', photo);
      });
      this.props.submitSaving(institutionData);
    }
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
      photosFiles: picture
    });
  }

  deleteAlreadySavedPicture(id) {
    let photos = this.state.photos.filter(photo => {
      return photo.id !== id;
    });
    this.setState({photos: photos})
  }

  addTag() {
   let tags = [...this.state.tags];
   tags.push(this.state.currentTag);
   this.setState({currentTag: '', tags})
  }

  deleteTag(i) {
   let tags = [...this.state.tags];
   tags.splice(i, 1);
   this.setState({tags});

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
        </Form.Group>
      </div>
    )
  }

  renderDescriptionStep() {
    return (
      <div>
        <Form.Field
          id='form-input-description'
          name='description'
          control={TextArea}
          label='Description'
          rows={10}
          onChange={this.handleChange}
          value={this.state.description}
        />
        <div className='field'>
          <label>Tags</label>
        <Input type='text'
               icon='tags'
               fluid
               iconPosition='left'
               name='currentTag'
               value={this.state.currentTag}
               onChange={this.handleChange}
               action={ <Button type='submit' onClick={this.addTag}>Add tag</Button>}
        >
        </Input>
        </div>
        <div className='tags-container'>
          <Label.Group color='teal'>
            {this.state.tags.map((tag, i) => {
              return <Label as='div' key={i}>
                  {tag}
                <Icon name='close' onClick={() => this.deleteTag(i)}/>
              </Label>
            })}
          </Label.Group>
        </div>
      </div>
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
    return <div>
      <ImageUploader
        withIcon={true}
        withPreview={true}
        withLabel={true}
        buttonText='Choose images'
        name='InstitutionPhoto'
        onChange={this.onDrop}
        imgExtension={['.jpg', '.png']}
        maxFileSize={5242880}
        defaultImages={this.state.photosFiles}
        alreadySavedPictures={this.state.photos}
        deleteAlreadySavedPicture={this.deleteAlreadySavedPicture}
      />
    </div>
  }

  renderFormStep() {
    let step = 1;
    switch (this.state.currentStep) {
      case 1:
        step = this.renderGeneralInfoStep();
        break;
      case 2:
        step = this.renderDescriptionStep();
        break;
      case 3:
        step = this.renderVisitingPlanStep();
        break;
      case 4:
        step = this.renderPhotosStep();
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
    if (this.state.currentStep !== this.state.numberOfSteps) {
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
      <ValidationForm
        ref={form => {
          this.form = form
        }}
        loading={this.state.isFormLoading}>
        {this.renderFormStep()}
        <div className='text-center'>
          <br/>
          <div className='text-center'>
            <Button
              icon
              labelPosition='left'
              secondary
              floated='left'
              onClick={this.goToThePreviousStep}
              disabled={this.state.buttonPreviousDisabled}
            >
              Back
              <Icon name='left arrow'/>
            </Button>
            {this.state.buttonNextSave}
          </div>
        </div>
      </ValidationForm>
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
