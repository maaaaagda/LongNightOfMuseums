import React from 'react';
import Footer from '../Footer/Footer';
import MainMenu from '../MainMenu'

const App = ({ children }) => (
  <>
    <MainMenu/>
    <main>
      <div className={'main-container'}>
        {children}
      </div>
    </main>
    <Footer />
  </>
);

export default App;
