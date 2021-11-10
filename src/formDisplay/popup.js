import React, { Component } from "react";
import Form from './Formik'

export default class PopUp extends Component {
  handleClick = () => {
   this.props.toggle();
  };

render() {
  return (
      <span onClick = {this.handleClick}>
          <Form/>
      </span>
  );
 }
}