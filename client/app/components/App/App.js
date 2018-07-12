import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'

const App = ({ children }) => (
  <>
    <Header />
    <Navbar />
    <main>
      {children}
    </main>

    <Footer />
  </>
);

export default App;
