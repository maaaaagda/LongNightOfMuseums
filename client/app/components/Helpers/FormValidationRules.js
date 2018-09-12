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

export const latitude = (value) => {
  let latRegex = /^(\+|-)?(?:90(?:(?:\.0{1,7})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,7})?))$/;
  if (!latRegex.test(value)) {
    return <span className="error">Insert a valid latitude value.</span>
  }
};

export const longitude = (value) => {
  let latRegex = /^(\+|-)?(?:180(?:(?:\.0{1,7})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,7})?))$/;
  if (!latRegex.test(value)) {
    return <span className="error">Insert a valid longitude value.</span>
  }
};
