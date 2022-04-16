import React from "react";
import { Alert } from "reactstrap";
export default function Notice(props) {
  return (
    <Alert className="error-popup" color="success">
      <span>{props.message}</span>
    </Alert>
  );
}
