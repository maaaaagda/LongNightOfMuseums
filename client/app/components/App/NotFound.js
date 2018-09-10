import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <>
    <div className={'main-container'}>
      <div className='main-photo'>
        <div className='jumbotron'>
          <div className='text-center'>
          <h1 className={'huge-title'}>404</h1>
          <h1 className={'app-title'}>Page not found</h1>
            <Link to='/'><h3>Go home</h3></Link>
          </div>
        </div>
      </div>
    </div>
  </>
);

export default NotFound;
