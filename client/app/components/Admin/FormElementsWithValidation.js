import { form, control, button } from 'react-validation';
import React from 'react';
import {Form, Input} from 'semantic-ui-react';

const CustomForm = ({ getValues, validate, validateAll, showError, hideError, children, size, loading, ...props }) => (
  <Form size={size} loading={loading}{...props}>{children}</Form>
);


const CustomInput = ({ error, isChanged, isUsed, required, label, type, ref, maxLen, minLen, ...props }) => (
  <Form.Field>
    <Form.Field
      control={Input}
      required={required}
      label={label}
      type={type}
      {...props} />
    <div className="error">{isChanged && isUsed && error}</div>
  </Form.Field>
);

export const ValidationInput = control(CustomInput);
export const ValidationForm = form(CustomForm);
