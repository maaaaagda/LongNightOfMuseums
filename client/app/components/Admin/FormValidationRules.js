import validator from 'validator';

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

export const lt = (value, props) => {
  if (!value.toString().trim().length > props.maxLength) {
   return `The value exceeded ${props.maxLength} symbols.`
  }
};

export const password = (value, props, components) => {
  // NOTE: Tricky place. The 'value' argument is always current component's value.
  // So in case we're 'changing' let's say 'password' component - we'll compare it's value with 'confirm' value.
  // But if we're changing 'confirm' component - the condition will always be true
  // If we need to always compare own values - replace 'value' with components.password[0].value and make some magic with error rendering.
  if (value !== components['confirm'][0].value) { // components['password'][0].value !== components['confirm'][0].value
    // 'confirm' - name of input
    // components['confirm'] - array of same-name components because of checkboxes and radios
    return <span className="error">Passwords are not equal.</span>
  }
};


