import React from 'react';
import Footer from '../Footer/Footer';
import MainMenu from '../MainMenu'
import ErrorBoundary from './ErrorBoundary';

const App = ({ children }) => (
  <>
    <MainMenu/>
    <ErrorBoundary>
    <main>
      <div className={'main-container'}>
        {children}
      </div>
    </main>
    </ErrorBoundary>
    <Footer />
  </>
);

export default App;
