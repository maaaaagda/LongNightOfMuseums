import {Link} from "react-router-dom";
import {Button, Grid, Image, Card, Checkbox, Icon, Modal, Header} from "semantic-ui-react";
import React from "react";
import connect from "react-redux/es/connect/connect";
import {load_institutions} from "../../store/actions/institutionActions";
import moment from "moment";
import InstitutionsFilterOrder from "./InstitutionsFilterOrder";
import MapContainer from "../Map/Map";
import {ValidationForm, ValidationInput} from "../Helpers/FormElementsWithValidation";
import {required} from "../Helpers/FormValidationRules";
import {create_route, get_routes} from "../../store/actions/routeActions";

class InstitutionsOverview extends React.Component {

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
      mapInstitutions: [],
      routeName: ''
    };
    this.hideModal = this.hideModal.bind(this);
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.handleOrderBySelectChange = this.handleOrderBySelectChange.bind(this);
    this.handleSearchByInstitutionName = this.handleSearchByInstitutionName.bind(this);
    this.handleRouteNameChange = this.handleRouteNameChange.bind(this);
    this.showGetRouteNameModal = this.showGetRouteNameModal.bind(this);
    this.getSavedRoutes = this.getSavedRoutes.bind(this);
    this.onRouteSave = this.onRouteSave.bind(this);
  }
  componentDidMount() {
    if(this.props.institutions.length > 0) {
      this.filterSortInstitutions();
    } else {
      this.props.dispatch(load_institutions())
        .then(() => {
          this.filterSortInstitutions();
        });
    }
  }
  componentDidUpdate() {
    if(this.props.institutions.length > 0 && this.state.originalInstitutions.length !== this.props.institutions.length ) {
      let original = this.props.institutions.map(inst => {
        inst.checked = false;
        return inst;
      });
      this.setState({originalInstitutions: original, institutions: this.props.institutions}, () => {
        this.filterSortInstitutions();
      })
    }
  }
  filterSortInstitutions() {
    let fromCity = this.getInstitutionsFromGivenCity(this.state.city, this.state.originalInstitutions);
    let filteredByName = this.getInstitutionsFilteredByName(this.state.searchByName, fromCity);
    let mapInstitutions = this.getOrderedInstitutions("InstitutionNameAsc", JSON.parse(JSON.stringify(filteredByName)));
    let ordered = this.getOrderedInstitutions(this.state.orderBy, filteredByName);
    this.setState({institutions: ordered, mapInstitutions});
  }
  getSavedRoutes() {
    this.props.dispatch(get_routes());
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
  handleChange(id) {
    let institutions = JSON.parse(JSON.stringify(this.state.institutions));
    let originalInstitutions = JSON.parse(JSON.stringify(this.state.originalInstitutions));
    let updatedInstitutions = [];
    let updatedOriginalInstitutions = [];
    institutions.forEach(inst => {
      if(inst._id === id){
        inst.checked = !inst.checked;
      }
      updatedInstitutions.push(inst);
    });

    originalInstitutions.forEach(inst => {
      if(inst._id === id){
        inst.checked = !inst.checked;
      }
      updatedOriginalInstitutions.push(inst);
    });

    let orderedMapInstitutions = this.getOrderedInstitutions("InstitutionNameAsc", updatedInstitutions);
    this.setState({institutions: orderedMapInstitutions,
      mapInstitutions: updatedInstitutions,
      originalInstitutions: updatedOriginalInstitutions
    })
  }
  getChosenInstitutions(){
    return this.state.mapInstitutions.filter(institution => {
      return institution.checked
    })
  }
  handleRouteNameChange(e) {
    this.setState({routeName: e.target.value})
  }
  routeNameExists = (value) => {
    if(this.props.routes){
      let routeNameExists = this.props.routes.find(route => {
        return route.routeName === value
      });
      if (routeNameExists) {
        return `Given name already exists.`
      }
    }
  };
  showGetRouteNameModal() {
    let modal = <Modal open={true} onClose={this.hideModal} size='small'>
      <Modal.Content>
        <Modal.Description>
          <Header>Save visiting path</Header>
          <ValidationForm
            ref={form => {
              this.form = form
            }}>
            <ValidationInput
              name='routeName'
              id='form-input-route-name'
              label='Route name'
              value={this.state.routeName}
              required
              validations={[required, this.routeNameExists]}
              onChange={this.handleRouteNameChange}
            />
          </ValidationForm>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={this.hideModal}>Cancel</Button>
        <Button
          color='green'
          inverted
          onClick={this.onRouteSave}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>;
    this.setState({modal})
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
  onRouteSave(e) {
    e.preventDefault();
    this.form.validateAll();
    if (this.isFormValid(this.form)) {
      let institutionsIds = this.getChosenInstitutions().map(inst => {
        return inst._id
      });
      let routeData = {
        name: this.state.routeName,
        institutions: institutionsIds
      };
      this.props.dispatch(create_route(routeData))
        .then((res) => {
          if(this.props.routes && this.props.routes.length > 0) {
            let routesCopy = JSON.parse(JSON.stringify(this.props.routes.map(route => route._id)));
            localStorage.setItem('sightseeingPath', JSON.stringify(routesCopy));
          }
          this.hideModal();
          let topPosOfDiv = document.getElementById('my-routes').getBoundingClientRect().top;
          window.scrollBy({top: topPosOfDiv - 70, behavior: 'smooth'});
          this.getSavedRoutes()
        })
        .catch((err) => {
          this.hideModal();
          console.log(err);
        });
    }
  }
  hideModal() {
    this.setState({ modal: '' })
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
              <Grid.Column mobile={4} tablet={4} computer={4}>
                <div className={"jumbotron-fully-centered"}>
                  {this.renderImage(institution)}
                </div>
              </Grid.Column>
             <Grid.Column mobile={7} tablet={7} computer={8}>
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
              <Grid.Column mobile={5} tablet={5} computer={4}>
                <div className='vertical-center-outer'>
                  <div className='museum-button'>
                    <Button basic color='blue' as={Link} to={`/institutions/${institution._id}`}> View more </Button>
                  </div>
                  <div className='museum-button'>
                    <Checkbox
                      id={'institution-to-visit-' + index}
                      checked={institution.checked}
                      onChange={() => this.handleChange( institution._id)}/>
                  </div>
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
  render (){
    return (
      <div className={'main-container jumbotron-padding-small'}>
        <Grid>
           <Grid.Row>
            <Grid.Column largeScreen={8} widescreen={8} mobile={16}>
              <div className='w-100'>
                <InstitutionsFilterOrder
                  handleCitySelectChange={this.handleCitySelectChange}
                  handleOrderBySelectChange={this.handleOrderBySelectChange}
                  handleSearchByInstitutionName={this.handleSearchByInstitutionName}
                  allCities={false}
                />
              </div>
              <div className='ui form'>
                <div className='field'>
                  <label> Select all institutions you wish to visit and generate the optimal sightseeing path. Start and end of the route is set to the city centre.</label>
                </div>
              </div>
              <div className='institution-container'>
                {this.renderInstitutionsList()}
              </div>
              <div className='save-path-button'>
                <Button fluid color='black' onClick={this.showGetRouteNameModal} disabled={this.getChosenInstitutions().length === 0}> Save path </Button>
              </div>
              <br/>
            </Grid.Column>
            <Grid.Column largeScreen={8} widescreen={8} mobile={16}>
              <div className={'map w-100'} id='map'>
                {/*<MapContainer*/}
                    {/*allInstitutions={this.state.mapInstitutions}*/}
                {/*/>*/}
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column largeScreen={10} widescreen={8} mobile={16}>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.modal}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    isAdmin: state.admin.isLoggedIn,
    institutions: state.institutions,
    routes: state.routes
  }
}

export default connect(mapStateToProps)(InstitutionsOverview);
