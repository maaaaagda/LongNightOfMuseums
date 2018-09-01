import ImageGallery from 'react-image-gallery';
import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';
import {load_institution} from "../../store/actions/institutionActions";
import CustomModal from "../Helpers/Modals";
import connect from "react-redux/es/connect/connect";

class InstitutionDetail extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      institutionId: '',
      institutionData: {
        name: '',
        description: '',
        website: '',
        address: '',
        latitude: '',
        longitude: '',
        city_id: '',
        photos:  [],
        visitingPlan: '',
        city: {
          name: ''
        }
      },
      modal: ''
    };
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }
  componentDidMount() {
    this.setState({institutionId: this.props.match.params.institutionId}, () => {
      this.props.dispatch(load_institution(this.state.institutionId))
        .then((res) => {
          this.setState({institutionData: res.data})
        })
        .catch((err) => {
          let errorModal = (
            <CustomModal
              modalType='simple'
              header='Fetching data failed'
              content={(err.response && err.response.data && err.response.data.message) ?
                err.response.data.message
                : 'Something went wrong, unable to fetch institution data'}
              hideModal={this.hideModal}
            />);
          this.showModal(errorModal);
        });
    });
  }
  showModal(modal) {
    this.setState({ modal: modal });
  }
  hideModal() {
    this.setState({ modal: '' })
  }
  renderPhotoGallery() {
    let images = this.state.institutionData.photos.map(photo => {
      return {original: photo.path}
    });
    return <ImageGallery
      items={images}
      showThumbnails={false}
      showPlayButton={false}
      autoPlay={true}
      slideInterval={10000}
      showBullets={true}
    />
  }

  render() {

    const panes = [
      { menuItem: 'Photo gallery', render: () =>
          <Tab.Pane
            as='div'
            className="museum-tab"
            attached='false'>
            {this.renderPhotoGallery()}
          </Tab.Pane>
      },
      { menuItem: 'Map', render: () => <Tab.Pane as='div' attached='false'>Map container</Tab.Pane> },
      { menuItem: 'Visiting', render: () => <Tab.Pane as='div' attached='false'>
          <div className='museum-visiting-plan'>
            {this.state.institutionData.visitingPlan}
          </div>
        </Tab.Pane> },
    ];

    return (
      <div className={'main-container'}>
        <Grid>
          <Grid.Row>
            <Grid.Column largeScreen={5} widescreen={8} mobile={16}>
              <div className='jumbotron-padding-small'>
                <div className='title padding-bottom-small'>
                  {this.state.institutionData.name}
                </div>
                <div className='secondary-info padding-bottom-medium'>
                  {this.state.institutionData.city.name}, {this.state.institutionData.address}
                </div>
                <div className='museum-description'>
                  {this.state.institutionData.description}
                </div>
              </div>
            </Grid.Column>
            <Grid.Column largeScreen={11} widescreen={8} mobile={16}>
              <div className='jumbotron-padding-small'>
                <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {this.state.modal}
      </div>
    );
  }
}

export default connect(null)(InstitutionDetail);
