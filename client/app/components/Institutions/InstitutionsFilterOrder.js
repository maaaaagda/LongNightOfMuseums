import React from 'react';
import {connect} from 'react-redux';
import {Form} from "semantic-ui-react";


class InstitutionsFilterOrder extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
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
        orderBy: 'InstitutionNameAsc',
        searchByName: ''
      };
      this.handleCitySelectChange = this.handleCitySelectChange.bind(this);
      this.handleOrderBySelectChange = this.handleOrderBySelectChange.bind(this);
      this.handleSearchByInstitutionName = this.handleSearchByInstitutionName.bind(this);
    }

  componentDidMount() {
    this.setState({cities: this.manageCitiesList(this.props.cities)});
  }

  componentDidUpdate() {
    if (this.props.cities.length > 0 && this.state.cities.length === 1) {
      this.setState({cities: this.manageCitiesList(this.props.cities)});
    }
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
    let city = citiesSelect.length > 0 ? citiesSelect[0].value : '';
    this.setState({city: city});
    this.props.handleCitySelectChange("", {name: "", value: city});
    return citiesSelect;
  }

  handleCitySelectChange(e, {name, value}) {
    this.setState({
      city: value
    }, () => {
      this.props.handleCitySelectChange(e, {name, value})
    })
  }

  handleSearchByInstitutionName(e, {name, value}) {
    this.setState({searchByName: value}, () => {
      this.props.handleSearchByInstitutionName(e, {name, value})
    });
  }

  handleOrderBySelectChange(e, {name, value}) {
    this.setState({
      orderBy: value
    }, () => {
      this.props.handleOrderBySelectChange(e, {name, value})
    })
  }

  render() {
        return (
          <Form>
            <Form.Group widths='equal'>
              <Form.Input
                fluid
                id='form-search'
                name='search'
                label='Search by institution name'
                onChange={this.handleSearchByInstitutionName}
                icon='search' />
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
            </Form.Group>
          </Form>
        )
    }


}

function mapStateToProps (state) {
  return {
    cities: state.cities
  }
}

export default connect(mapStateToProps)(InstitutionsFilterOrder);
