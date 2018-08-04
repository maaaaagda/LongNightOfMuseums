import validator from 'validator';
import React from 'react';
export const required = (value) => {
  if (!value.toString().trim().length) {
    return 'Field cannot be empty';
  }
};

export const email = (value) => {
  if (!validator.isEmail(value)) {
    return `Please provide a valid email.`
  }
};

export const max_length = (value, props) => {
  if (value.toString().trim().length > props.maxLen) {
   return `The value exceeded ${props.maxLen} symbols.`
  }
};

export const min_length = (value, props) => {
  if (value.toString().trim().length < props.minLen) {
    return `The value must contain at least ${props.minLen} symbols.`
  }
};

export const password = (value, props, components) => {
   if (value !== components['password'][0].value) {
    return <span className="error">Passwords are not equal.</span>
  }
};


