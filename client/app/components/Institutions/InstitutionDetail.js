import ImageGallery from 'react-image-gallery';
import React from 'react';
import { Grid, Tab } from 'semantic-ui-react';

class InstitutionDetail extends React.Component {

  constructor(props) {
    super(props);
  }

  renderPhotoGallery() {
    const images = [
      {
        original: '/api/institutionsphotos/InstitutionPhoto_1535482812081.jpeg'
      },
      {
        original: '/api/institutionsphotos/InstitutionPhoto_1535482858723.png'
      },
      {
        original: '/api/institutionsphotos/InstitutionPhoto_1535482812081.jpeg'
      }
    ];
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
      { menuItem: 'Map', render: () => <Tab.Pane as='div' attached='false'>Tab 2 Content</Tab.Pane> },
      { menuItem: 'Visiting', render: () => <Tab.Pane as='div' attached='false'>Tab 3 Content</Tab.Pane> },
    ];

    return (
      <div className={'main-container'}>
        <Grid>
          <Grid.Row>
            <Grid.Column largeScreen={5} widescreen={8} mobile={16}>
              <div className='jumbotron-padding-small'>
                <div className='title padding-bottom-small'>
                  National Museum
                </div>
                <div className='secondary-info padding-bottom-medium'>
                  Wrocław, Świdnicka 45/6
                </div>
                <div className='museum-description'>
                  The National Museum in Wrocław (Polish: Muzeum Narodowe we Wrocławiu), established the 28 of March 1947 and officially inaugurated on the 11th of July 1948, is one of Poland's main branches of the National Museum system. It holds one of the largest collections of contemporary art in the country.[2]
                  The holdings of Wrocław Museum are closely connected with the history of border shifts in Central Europe following World War II. After the annexation of Eastern half of the Second Polish Republic by the Soviet Union, main parts of Poland's art collections were transferred from the cities incorporated into the USSR like Lviv. Collections not returned included the Ossolineum holdings which became part of the Lviv National Museum.[3] The cultural heritage shipped in 1946 included Polish and European paintings from 17th to 19th centuries. The 1948 unveiling of the Wrocław Gallery of Polish Painting at a brand new location, composed of national treasures from already disappropriated museums, had a symbolic meaning in the lives of people subjected to mass expulsions from the Eastern Borderlands. The Gallery was arranged to remind them, that they were again residing in Poland
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

      </div>
    );
  }
}

export default InstitutionDetail;
