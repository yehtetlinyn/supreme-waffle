"use client";
import React from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import previewStyle from "./style.module.css";

const PreviewForm = () => {
  return (
    <>
      <Card className={previewStyle.card}>
        <CardBody>
          <CardTitle>Preview</CardTitle>
          <CardText>This is preview section.</CardText>
        </CardBody>
      </Card>
    </>
  );
};

export default PreviewForm;
