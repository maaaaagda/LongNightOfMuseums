import {Link} from "react-router-dom";
import {Button, Container, Grid, Image, Card, Checkbox} from "semantic-ui-react";
import React from "react";
import connect from "react-redux/es/connect/connect";
import {load_institutions} from "../../store/actions/institutionActions";
import moment from "moment";
import InstitutionsFilterOrder from "./InstitutionsFilterOrder";


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
      originalInstitutions: []
    };
    this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
    this.handleOrderBySelectChange = this.handleOrderBySelectChange.bind(this);
    this.handleSearchByInstitutionName = this.handleSearchByInstitutionName.bind(this);
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
      this.setState({originalInstitutions: this.props.institutions, institutions: this.props.institutions}, () => {
        this.filterSortInstitutions();
      })
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
  renderInstitutionsList() {
    let resultList = [];
    this.state.institutions.map((institution, index) => {
      let result = (
        <Card fluid key={index} className='institution-card'>
          <Grid celled='internally'>
            <Grid.Row>
             <Grid.Column mobile={11} tablet={6} computer={12}>
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
                  <div className='museum-button'>
                    <Button basic color='blue' as={Link} to={`/institutions/${institution._id}`}> View more </Button>
                  </div>
                  <div className='museum-button'>
                    <Checkbox />
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
            <Grid.Column largeScreen={10} widescreen={8} mobile={16} className="p-0">
              <div className='w-100'>
                <InstitutionsFilterOrder
                  handleCitySelectChange={this.handleCitySelectChange}
                  handleOrderBySelectChange={this.handleOrderBySelectChange}
                  handleSearchByInstitutionName={this.handleSearchByInstitutionName}
                />
              </div>
              <Container className={'footer-photo p-0'}>
                <Image src={require('../../assets/footer_picture_2.jpg')} size={'huge'} centered/>
              </Container>
            </Grid.Column>
            <Grid.Column largeScreen={6} widescreen={8} mobile={16}>
              <p> Select all institutions you want to visit and generate the optimal sightseeing path.</p>
              {/*<label>Select each institution from the list <Checkbox /></label>*/}
              <div className='institution-container'>
                {this.renderInstitutionsList()}
              </div>
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
    institutions: state.institutions
  }
}

export default connect(mapStateToProps)(InstitutionsOverview);
