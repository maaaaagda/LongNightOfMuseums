import React from 'react';
import {connect} from 'react-redux';
import {Button, Form, Icon, Select, TextArea} from "semantic-ui-react";
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required} from "../Helpers/FormValidationRules";
import PropTypes from "prop-types";


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
      town: this.props.institutionData.town || 1,
      towns: [
        { key: '1', text: 'Wrocław', value: 1 },
        { key: '2', text: 'Poznań', value: 2 },
        { key: '3', text: 'Warszawa', value: 3 }
      ],
      visitingPlan: this.props.institutionData.visitingPlan || '',
      currentStep: 1,
      buttonPreviousDisabled: true,
      buttonNextSave: ''
    };
    this.ensureSavingInstitution = this.ensureSavingInstitution.bind(this);
    this.goToTheNextStep = this.goToTheNextStep.bind(this);
    this.goToThePreviousStep = this.goToThePreviousStep.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.setState({buttonNextSave: buttonNext})
  }
  componentWillReceiveProps(nextProps) {
      this.setState({
        isFormLoading: nextProps.isFormLoading,
        name: nextProps.institutionData.name || '',
        description: nextProps.institutionData.description || '',
        website: nextProps.institutionData.website || '',
        address: nextProps.institutionData.address || '',
        latitude: nextProps.institutionData.latitude || '',
        longitude: nextProps.institutionData.longitude || '',
        town: nextProps.institutionData.town || 1,
        visitingPlan: nextProps.institutionData.visiting_plan || ''
      });
    }
  ensureSavingInstitution(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.isFormValid(this.form)) {
      let institution_data = {
        name: this.state.name,
        website: this.state.website,
        town_id: this.state.town,
        address: this.state.address,
        description: this.state.description,
        visiting_plan: this.state.visitingPlan,
        latitude: this.state.latitude,
        longitude: this.state.longitude
      };
      this.props.submitSaving(institution_data);
    }
  }

  handleChange (e){
    this.setState({
      [e.target.name]: e.target.value
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
            id='form-input-town'
            name='town'
            control={Select}
            label='Town'
            required
            onChange={this.handleChange}
            options={this.state.towns}
            value={this.state.town}
            validations={[required]}
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
        state: state
    }
}

export default connect(mapStateToProps)(InstitutionForm);
