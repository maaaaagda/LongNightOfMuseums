import ImageGallery from 'react-image-gallery';
import React from 'react';

class InstitutionDetail extends React.Component {

  render() {

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

    return (
      <div className={'main-container'}>
        <div className='jumbotron-padding-y'>
          <ImageGallery
            items={images}
            showThumbnails={false}
            showPlayButton={false}
            autoPlay={true}
            slideInterval={10000}
          />
        </div>
      </div>
    );
  }
}

export default InstitutionDetail;
