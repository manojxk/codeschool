import React from "react";
import { Alert } from "reactstrap";
export default function ErrorNotice(props) {
  return (
    <Alert className="error-popup" color="danger">
      <span>{props.message}</span>
    </Alert>
  );
}
