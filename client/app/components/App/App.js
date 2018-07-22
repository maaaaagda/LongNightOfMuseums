import React from 'react';
import Footer from '../Footer/Footer';
import MainMenu from '../MainMenu'

const App = ({ children }) => (
  <>
    <MainMenu/>
    <main>
      {children}
    </main>
    <Footer />
  </>
);

export default App;
