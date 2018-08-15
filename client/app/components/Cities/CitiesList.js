import React from 'react';
import {connect} from 'react-redux';
import {create_city, delete_city, load_cities, update_city} from "../../store/actions/cityActions";
import {Button, Segment, Table, Popup, Icon} from "semantic-ui-react";
import CustomModal from "../Helpers/Modals";
import CityCreateEdit from "./CityCreateEdit";

class CitiesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: ''
    };
    this.hideModal = this.hideModal.bind(this);
    this.ensureSavingCity = this.ensureSavingCity.bind(this);
    this.openNewCityForm = this.openNewCityForm.bind(this);
    this.openUpdateCityForm = this.openUpdateCityForm.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(load_cities())
  }

  ensureDeletingCity(id, cityName) {
    let confirmModal = (
      <CustomModal
        modalType='confirm'
        header='Remove city'
        content={`Are you sure you want to delete city '${cityName}'?`}
        hideModal={this.hideModal}
        performAction={() => {this.deleteCity(id)}}
      />
    );
    this.showModal(confirmModal);
  }
  ensureSavingCity(cityName, id) {
    let confirmModal;
    if(id) {
      confirmModal = (
        <CustomModal
          modalType='confirm'
          header='Update city name'
          content={`Are you sure you want to update city name to '${cityName}'?`}
          hideModal={this.hideModal}
          performAction={() => {this.updateCity(id, cityName)}}
        />
      );
    } else {
      confirmModal = (
        <CustomModal
          modalType='confirm'
          header='New city'
          content={`Are you sure you want to save city '${cityName}'?`}
          hideModal={this.hideModal}
          performAction={() => {this.createNewCity(cityName)}}
        />
      );
    }

    this.showModal(confirmModal);
  }
  updateCity(id, cityName) {
    this.props.dispatch(update_city(id, cityName))
      .then(() => {
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='City updated successfully.'
            hideModal={this.hideModal}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={err.response.data.message || 'Something went wrong, unable to delete selected city'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  createNewCity(cityName) {
    this.props.dispatch(create_city(cityName))
      .then(() => {
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='City created successfully.'
            hideModal={this.hideModal}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={err.response.data.message || 'Something went wrong, unable to delete selected city'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  openNewCityForm() {
    let addCityModal = (
      <CityCreateEdit
        hideModal={this.hideModal}
        headerName={'Add new city'}
        handleSubmit={this.ensureSavingCity}
      />
    );
    this.showModal(addCityModal);
  }
  openUpdateCityForm(id, cityName) {
    let updateCityModal = (
      <CityCreateEdit
        hideModal={this.hideModal}
        headerName={'Update city'}
        handleSubmit={this.ensureSavingCity}
        cityName={cityName}
        cityId={id}
      />
    );
    this.showModal(updateCityModal);
  }
  showModal(modal) {
    this.setState({ modal: modal });
  }
  hideModal() {
    this.setState({ modal: '' })
  }

  deleteCity(id) {
    this.props.dispatch(delete_city(id))
      .then(() => {
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='City deleted successfully.'
            hideModal={this.hideModal}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={err.response.data.message || 'Something went wrong, unable to delete selected city'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }

  renderCitiesList() {
    let citiesList = [];
    this.props.cities.map((city, i) => {
      let cityDetail = (
        <Table.Row key={i}>
          <Table.Cell>{city.name}</Table.Cell>
          <Table.Cell textAlign='center'>{city.institutions_count}</Table.Cell>
          <Table.Cell>
            <Button
              basic
              color='red'
              onClick={() => this.ensureDeletingCity(city._id, city.name)}
              disabled={city.institutions_count != 0}>
              Remove
            </Button>
            <Button
              basic color='black'
              onClick={() => {this.openUpdateCityForm(city._id, city.name)}}
            >
              Edit
            </Button>
          </Table.Cell>
        </Table.Row>
      );
      citiesList.push(cityDetail)
    });
    return citiesList;
  }

  renderCityTable() {
    let cityTable = this.props.cities.length !== 0 ?
      (
        <div className={'table-container'}>
          <Table selectable size='large'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell textAlign='center'>Nr of institutions</Table.HeaderCell>
                <Table.HeaderCell textAlign='right'>
                  <Popup
                    trigger={<Icon size='large' name='question circle outline'/>}
                    content='Only cities which are not assigned to any institution can be deleted'
                    position='bottom left'
                    basic
                  />
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.renderCitiesList()}
            </Table.Body>
          </Table>
        </div>
      )
      :
      <div> No data available </div>;

    return cityTable;
  }

  render() {
    return (
      <div className='jumbotron-top-small'>
        <Segment.Group horizontal>
          <Segment textAlign='left'><h1> List of all cities </h1></Segment>
          <Segment textAlign='right'>
            <Button color='black' onClick={this.openNewCityForm}>
              Add new city
            </Button>
          </Segment>
        </Segment.Group>
        <br/>
        {this.renderCityTable()}
        {this.state.modal}
      </div>

    )
  }


}

function mapStateToProps(state) {
    return {
        cities: state.cities
    }
}

export default connect(mapStateToProps)(CitiesList);
