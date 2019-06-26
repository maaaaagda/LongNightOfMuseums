import {Map, Marker, GoogleApiWrapper, Polyline} from 'google-maps-react';
import React from 'react';
import _ from 'lodash';

const DEFAULT_LAT = 51.107883;
const DEFAULT_LNG = 17.038538;

export class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      institutions: [],
      institutionsToVisit: [],
      route: [],
      centerLat: '',
      centerLng: ''
    };
    this.calcRoute = this.calcRoute.bind(this);
    this.getRoute = this.getRoute.bind(this);
  }
  componentDidMount() {
    if(this.props.allInstitutions.length > 0 && !_.isEqual(this.props.allInstitutions, this.state.institutions)) {
      this.getRoute();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (!_.isEqual(nextProps.allInstitutions, this.state.institutions) ||
      nextState.route !== this.state.route);
  }
  componentDidUpdate() {
    if(this.props.allInstitutions.length > 0 && !_.isEqual(this.props.allInstitutions, this.state.institutions)) {
      this.getRoute();
    }
  }

  getRoute() {
    let institutionsToVisit = [];
    this.props.allInstitutions.forEach(inst => {
      if(inst.checked) {
        institutionsToVisit.push(inst)
      }
    });
    this.setState({institutions: this.props.allInstitutions,
      centerLat: this.props.allInstitutions[0].city.latitude ,
      centerLng: this.props.allInstitutions[0].city.longitude,
      institutionsToVisit
    }, () => {
      if(institutionsToVisit.length > 0) {
        this.calcRoute()
      } else {
        this.setState({route: []})
      }
    })
  }

  calcRoute() {
    let directionsService = new google.maps.DirectionsService();
    let waypoints = this.state.institutionsToVisit.map(inst => {
      return {
        location: new google.maps.LatLng(inst.latitude, inst.longitude),
        stopover: true
      }
    });
    let request = {
      origin: new google.maps.LatLng(this.state.centerLat, this.state.centerLng),
      destination: new google.maps.LatLng(this.state.centerLat, this.state.centerLng),
      waypoints: waypoints,
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    let pathPoints = [];
    directionsService.route(request, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK) {
        pathPoints = response.routes[0].overview_path.map(location => {
          return {lat: location.lat(), lng: location.lng()};
        });
        this.setState({route: pathPoints})

      } else {
        console.warn("directions response " + status);
      }
    });

  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={13}
        initialCenter={{
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG
        }}
        center={{
          lat: this.state.centerLat > 0 ? this.state.centerLat : DEFAULT_LAT,
          lng: this.state.centerLng > 0 ? this.state.centerLng : DEFAULT_LNG
        }}>
        <Polyline
          path={this.state.route}
          strokeColor="#00FF00"
          strokeOpacity={0.8}
          strokeWeight={7} />
        {this.state.institutions.map(institution => {
          return <Marker
            key={institution._id}
            title={institution.name}
            name={institution.name}
            position={{lat: institution.latitude, lng: institution.longitude}}
            icon={{
              url: institution.checked ? require('../../assets/map_museum_pin_checked.png') : require('../../assets/map_museum_pin.png'),
              anchor: new google.maps.Point(32,32),
              scaledSize: new google.maps.Size(64,64)
            }}
          />
        })}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.GOOGLE_MAPS_API_KEY)
})(MapContainer)
