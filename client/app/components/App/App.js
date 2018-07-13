import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar'
import MainMenu from '../MainMenu'

const App = ({ children }) => (
  <>
    <MainMenu/>
    <Header />
    <Navbar />
    <main>
      {children}
    </main>

    <Footer />
  </>
);

export default App;
