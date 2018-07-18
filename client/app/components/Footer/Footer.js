import React from 'react'
import { Grid, Image, Container} from 'semantic-ui-react'

const Footer= () => (
  <footer className={'main-container'}>
    <Grid celled={'internally'} inverted>
      <Grid.Row stretched>
        <Grid.Column largeScreen={4} widescreen={3} mobile={16}>
          <Container className={'footer-about'}>
            <p>The Long Night of Museums (or the Night of Museums) is a cultural event in which museums and cultural institutions in an area cooperate to remain open late into the night to introduce themselves to new potential patrons. Visitors are given a common entrance pass which grants them access to all exhibits as well as complimentary public transportation within the area.
            The first Long Night of Museums (German: Lange Nacht der Museen) took place in Berlin in 1997.[1] The concept has been very well received, and since then the number of participating institutions and exhibitions has risen dramatically, spreading to over 120 other cities throughout Europe, as well as elsewhere, in Argentina and the Philippines.
            </p>
          </Container>
        </Grid.Column>
        <Grid.Column largeScreen={12} widescreen={13} mobile={16}>
          <Grid celled={'internally'} inverted>
            <Grid.Row>
              <Container className={'footer-photo'}>
                <Image src={require('../../assets/footer_picture_2.jpg')} size={'huge'} centered/>
              </Container>
            </Grid.Row>
            <Grid.Row>
              <Container>
                <div className={'footer-info'}>
                  <h5>Contact</h5>
                  <p>longnightofmuseums@culture.com</p>
                </div>
              </Container>
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </footer>
);

export default Footer;
