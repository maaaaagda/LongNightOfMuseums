import React from 'react';
import { connect } from 'react-redux';
import {load_institutions, delete_institution} from "../../store/actions/institutionActions";
import {Card, Image, Grid, Button, Segment, Loader, Dimmer, Label} from 'semantic-ui-react';
import {Link} from "react-router-dom";
import CustomModal from "../Helpers/Modals";
import {Icon} from "semantic-ui-react";
import moment from 'moment';
import InstitutionsFilterOrder from "./InstitutionsFilterOrder";

class Institutions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormLoading: false,
      modal: '',
      city: 'allCities',
      orderBy: 'InstitutionNameAsc',
      searchByName: '',
      institutions: [],
      originalInstitutions: [],
      loadingData: false
    };
    this.hideModal = this.hideModal.bind(this);
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.handleOrderBySelectChange = this.handleOrderBySelectChange.bind(this);
    this.handleSearchByInstitutionName = this.handleSearchByInstitutionName.bind(this);
  }

  componentDidMount() {
    if(this.props.institutions.length > 0) {
      this.filterSortInstitutions();
    } else {
      this.setState({loadingData: true});
      this.props.dispatch(load_institutions())
        .then(() => {
          this.filterSortInstitutions();
          this.setState({loadingData: false})
        });
    }
  }
  componentDidUpdate() {
    if(this.props.institutions.length > 0 && this.state.originalInstitutions.length !== this.props.institutions.length ) {
      this.setState({originalInstitutions: this.props.institutions, institutions: this.props.institutions}, () => {
        this.filterSortInstitutions();
      })
    }
  }
  filterSortInstitutions() {
    let fromCity = this.getInstitutionsFromGivenCity(this.state.city, this.state.originalInstitutions);
    let filteredByName = this.getInstitutionsFiltered(this.state.searchByName, fromCity);
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
  getInstitutionsFiltered(value, institutions) {
    return institutions.filter(institution => {
      let institutionData = institution.name + JSON.stringify(institution.tags) + institution.address;
      return institutionData.toLowerCase().indexOf(value.toLowerCase()) >= 0;
    });
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
  ensureDeletingInstitution(id) {
      let confirmModal = (
      <CustomModal
        modalType='confirm'
        header='Remove institution'
        content='Are you sure you want to delete chosen institution?'
        hideModal={this.hideModal}
        performAction={() => {this.deleteInstitution(id)}}
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
  deleteInstitution(id) {
    this.setState({loadingData: true});
    this.props.dispatch(delete_institution(id))
      .then(() => {
        this.setState({loadingData: false});
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
        this.setState({loadingData: false});
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
      image = <div className={"thumbnail-photo"}>
        <Image src={"/api/institutionsphotos/" + institution.photos[0].id} fluid />
      </div>
    } else {
      image = <div className='jumbotron-fully-centered'> <Icon name='university' size={'huge'}/></div>;
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
                  {this.renderImage(institution)}
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
                    <div className='tags-container'>
                      <Label.Group color='teal'>
                        {institution && Array.isArray(institution.tags) && institution.tags.map((tag, i) => {
                          return <Label as='div' key={i}>
                            {tag}
                          </Label>
                        })}
                      </Label.Group>
                    </div>
                  </Card.Description>
                </Card.Content>
              </Grid.Column>
              <Grid.Column mobile={5} tablet={3} computer={4}>
                <div className='vertical-center-outer'>
                   <div className='museum-button'>
                    <Button basic color='blue' as={Link} to={`/institutions/${institution._id}`}> View more </Button>
                  </div>
                  {this.props.isAdmin ? (
                    <div className='museum-button'>
                      <Button basic color='black' as={Link} to={`/admin/institutions/${institution._id}`}> Edit </Button>
                    </div>
                  ) : ""}
                  {this.props.isAdmin ? (
                    <div className='museum-button'>
                      <Button basic color='red'
                              onClick={this.ensureDeletingInstitution.bind(this, institution._id)}> Delete </Button>
                    </div>
                  ) : ""}

                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card>
      );
      resultList.push(result);
    });
    let noSearchResults =  <div className='jumbotron-fully-centered'><h3>No search results</h3></div>;
    if(this.state.loadingData) {
      return <div className='jumbotron-fully-centered'>
        <Dimmer active inverted>
          <Loader inverted>Loading...</Loader>
        </Dimmer>
      </div>
    }
    if(resultList.length === 0){
      return noSearchResults;
    }
    return resultList;
  }
  render() {
    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y-small'>
          <Segment.Group horizontal>
            <Segment textAlign='left'><h1> List of all institutions </h1></Segment>
            {this.props.isAdmin ? (
              <Segment textAlign='right' as={Link} to={"/admin/institutions/new"}>
                <Button color='black'>
                  Add new institution
                </Button>
              </Segment>
            ) : ""}

          </Segment.Group>
          <InstitutionsFilterOrder
            handleCitySelectChange={this.handleCitySelectChange}
            handleOrderBySelectChange={this.handleOrderBySelectChange}
            handleSearchByInstitutionName={this.handleSearchByInstitutionName}
            allCities={true}
          />
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
    isAdmin: state.admin.isLoggedIn
  }
}

export default connect(mapStateToProps)(Institutions);
