import React from 'react';
import { connect } from 'react-redux';
import {load_institutions, delete_institution, delete_institution_photos} from "../../store/actions/institutionActions";
import {Card, Image, Grid, Button, Segment, Select} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import CustomModal from "../Helpers/Modals";
import {Icon, Form, Search} from "semantic-ui-react";
import moment from 'moment';

class Institutions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormLoading: false,
      modal: '',
      cities: [],
      city: '',
      orderByOptions: [
        {
          key: 1,
          text: "Institution name ascending",
          value: "InstitutionNameAsc"
        },
        {
          key: 2,
          text: "Institution name descending",
          value: "InstitutionNameDesc"
        },
        {
          key: 3,
          text: "Creation date ascending",
          value: "CreationAsc"
        },
        {
          key: 4,
          text: "Creation date descending",
          value: "CreationDesc"
        }
    ],
      orderBy: 'InstitutionNameDesc',
      searchByName: '',
      institutions: [],
      originalInstitutions: []
    };
    this.hideModal = this.hideModal.bind(this);
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.handleOrderBySelectChange = this.handleOrderBySelectChange.bind(this);
    this.handleSearchByInstitutionName = this.handleSearchByInstitutionName.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(load_institutions())
      .then(() => {});
    this.setState({cities: this.manageCitiesList(this.props.cities)});
  }
  componentDidUpdate() {
    if(this.props.cities.length > 0 && this.state.cities.length === 1) {
      this.setState({cities: this.manageCitiesList(this.props.cities)});
    }
    if(this.props.institutions.length > 0 && this.state.originalInstitutions.length === 0) {
      this.setState({originalInstitutions: this.props.institutions, institutions: this.props.institutions})
    }
  }
  filterSortInstitutions() {
    let fromCity = this.getInstitutionsFromGivenCity(this.state.city, this.state.originalInstitutions);
    let filteredByName = this.getInstitutionsFilteredByName(this.state.searchByName, fromCity);
    let ordered = this.getOrderedInstitutions(this.state.orderBy, filteredByName);
    this.setState({institutions: ordered});
  }
  getInstitutionsFromGivenCity(value, institutions) {
    if(value === 'allCities') {
      return institutions
    } else {
      let filteredInstitutions = institutions.filter(institution => {
        return institution.city_id === value;
      });
      return filteredInstitutions
    }
  }
  getInstitutionsFilteredByName(value, institutions) {
    let filteredInstitutions = institutions.filter(institution => {
      return institution.name.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
    return filteredInstitutions;
  }
  getOrderedInstitutions(value, institutions) {
    let orderedInstitutions;
    switch(value) {
      case "InstitutionNameAsc":
        orderedInstitutions = institutions.sort((a,b) => {
          return a.name.localeCompare(b.name)
        });
        break;
      case "InstitutionNameDesc":
        orderedInstitutions = institutions.sort((a,b) => {
          return b.name.localeCompare(a.name)
        });
        break;
      case "CreationAsc":
        orderedInstitutions = institutions.sort((a,b) => {
          return moment(a.created_at).diff(moment(b.created_at));
        });
        break;
      case "CreationDesc":
        orderedInstitutions = institutions.sort((a,b) => {
          return moment(b.created_at).diff(moment(a.created_at));
        });
        break;
    }
    return orderedInstitutions
  }
  handleCitySelectChange (e, {name, value}){
    this.setState({
      city: value
    }, () => {
      this.filterSortInstitutions()
    })
  }
  handleSearchByInstitutionName(e, {name, value}) {
    this.setState({searchByName: value}, () => {
      this.filterSortInstitutions()
    });

  }
  handleOrderBySelectChange (e, {name, value}){
    this.setState({
      orderBy: value
    }, () => {
      this.filterSortInstitutions()
    })
  }
  manageCitiesList(cities) {
    let citiesSelect = [];
    let allCities = {
      key: 'allCities',
      text: 'All cities',
      value: 'allCities'
    };
    citiesSelect.push(allCities);
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
  ensureDeletingInstitution(id, photos) {
    let photosIds = photos.map(photo => {
      return photo.id
    });

    let confirmModal = (
      <CustomModal
        modalType='confirm'
        header='Remove institution'
        content='Are you sure you want to delete chosen institution?'
        hideModal={this.hideModal}
        performAction={() => {this.deleteInstitution(id, photosIds)}}
      />
    );
    this.showModal(confirmModal);
  }
  showModal(modal) {
    this.setState({ modal: modal });
  }
  hideModal() {
    this.setState({ modal: '' })
  }
  deleteInstitution(id, photosIds) {
    this.props.dispatch(delete_institution_photos(photosIds))
      .then(() => {
        return  this.props.dispatch(delete_institution(id));
      })
      .then(() => {
        let successModal = (
          <CustomModal
            modalType='simple'
            header='Operation completed successfully'
            content='Institution deleted successfully.'
            hideModal={this.hideModal}
          />);
        this.showModal(successModal);
      })
      .catch((err) => {
        let errorModal = (
          <CustomModal
            modalType='simple'
            header='Operation failed'
            content={(err.response && err.response.data && err.response.data.message)? err.response.data.message : 'Something went wrong, unable to delete selected institution'}
            hideModal={this.hideModal}
          />);
        this.showModal(errorModal);
      })
  }
  renderImage(institution) {
    let image;
    if(institution.photos.length > 0) {
      image = <Image src={"/api/institutionsphotos/" + institution.photos[0].id} fluid />
    } else {
      image = <Icon name='university' size={'huge'}/>;
    }
    return image;
  }
  renderInstitutionsList() {
    let resultList = [];
    this.state.institutions.map((institution, index) => {
      let result = (
        <Card fluid key={index} className='institution-card'>
          <Grid celled='internally'>
            <Grid.Row>
              <Grid.Column tablet={7} computer={4} only='computer tablet'>
                  <div className={"jumbotron-fully-centered"}>
                    {this.renderImage(institution)}
                  </div>
              </Grid.Column>
              <Grid.Column mobile={11} tablet={6} computer={8}>
                <Card.Content>
                  <Card.Header>
                    <h2>{institution.name}</h2>
                  </Card.Header>
                  <Card.Meta>
                    <span>{institution.address}</span>
                  </Card.Meta>
                  <br/>
                  <Card.Description>
                    <a>{institution.website}</a>
                  </Card.Description>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={5} tablet={3} computer={4}>
                <div className='vertical-center-outer'>
                  <Button basic color='red' onClick={this.ensureDeletingInstitution.bind(this, institution._id, institution.photos)}> Delete </Button>
                  <br/>
                  <Button basic color='black' as={Link} to={`/institutions/${institution._id}`}> Edit </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
      );
      resultList.push(result);
    });
    return resultList.length === 0 && this.state.originalInstitutions.length > 0 ? <div className='jumbotron-fully-centered'><h3>No search results</h3></div> : resultList;
  }
  render() {
    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y-small'>
          <Segment.Group horizontal>
            <Segment textAlign='left'><h1> List of all institutions </h1></Segment>
            <Segment textAlign='right' as={Link} to={"/institutions/new"}>
              <Button color='black'>
                Add new institution
              </Button>
            </Segment>
          </Segment.Group>
          <Form>
            <Form.Group widths='equal'>
              <Form.Select
                fluid
                id='form-input-city'
                name='city'
                label='City'
                onChange={this.handleCitySelectChange}
                options={this.state.cities}
                value={this.state.city}
              />
              <Form.Select
                fluid
                id='form-order-by'
                name='orderBy'
                label='Order by'
                onChange={this.handleOrderBySelectChange}
                options={this.state.orderByOptions}
                value={this.state.orderBy}
              />
              <Form.Input
                fluid
                id='form-search'
                name='search'
                label='Search by institution name'
                onChange={this.handleSearchByInstitutionName}
                icon='search' />
            </Form.Group>
          </Form>
          <div className='institution-container'>
            {this.renderInstitutionsList()}
          </div>
          {this.state.modal}
        </div>
      </div>
    )
  }
}


function mapStateToProps (state) {
  return {
    institutions: state.institutions,
    cities: state.cities
  }
}

export default connect(mapStateToProps)(Institutions);
