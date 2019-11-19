import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";
import { CheckCircle } from "react-feather";

import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";

import CDTNReferences from "./components/CDTNReferences";
import MarkdownLink from "./components/MarkdownLink";

const DataSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Titre trop court")
    .required("Titre requis")
});

const MultiLineInput = props => (
  <Input
    type="textarea"
    style={{ fonSize: "1.4em" }}
    onBlur={props.handleBlur}
    onChange={props.onChange}
    {...props}
  />
);

const StyledForm = styled(Form)`
  .row {
    padding: 10px;
    border: 1px solid silver;
    border-radius: 2px;
    background: #efefef;
  }
  label {
    font-weight: bold;
  }
`;

const GlossaireForm = ({ data, onSubmit, onDelete }) => (
  <React.Fragment>
    <h1 style={{ margin: "1em 0" }}>Glossaire</h1>
    <Container>
      <Formik
        key={JSON.stringify(data)}
        enableReinitialize={true}
        initialValues={data}
        validationSchema={DataSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          onSubmit(values).then(() => {
            actions.setStatus({ msg: "Données enregistrées" });
            actions.setTouched(false);
          });
        }}
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          isSubmitting
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Row style={{ marginBottom: 10 }}>
              <Col xs="6">
                <FormGroup row>
                  <Label>Titre du terme</Label>
                  <Input
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue={(values && values.title) || ""}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label>Abbréviations (une par ligne)</Label>
                  <MultiLineInput
                    name="abbrs"
                    rows={3}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue={(values && values.abbrs) || ""}
                  />
                </FormGroup>
              </Col>
              <Col xs="3">
                <FormGroup>
                  <Label>Synonymes (un par ligne)</Label>
                  <MultiLineInput
                    name="variants"
                    rows={3}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue={(values && values.variants) || ""}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup row>
              <Label>
                Définition <MarkdownLink />
              </Label>
              <MultiLineInput
                name="definition"
                rows={10}
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={(values && values.definition) || ""}
              />
            </FormGroup>

            <FormGroup row>
              <Label>Sources</Label>
              <CDTNReferences
                sortable={true}
                loadable={true}
                values={values}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
              />
            </FormGroup>

            {/* show formik errors */}
            {(Object.keys(errors).length && (
              <Alert color="danger" style={{ margin: "15px 0" }}>
                {Object.keys(errors)
                  .map(key => errors[key])
                  .map(error => (
                    <Alert key={error} color="error">
                      {error}
                    </Alert>
                  ))}
              </Alert>
            )) ||
              null}
            {/* show submit status */}
            {status && status.msg && (
              <Alert color="success" style={{ margin: "15px 0" }}>
                <CheckCircle /> {status.msg}
              </Alert>
            )}

            <Row spacing={24}>
              <Col xs={6}>
                <Button
                  color="primary"
                  style={{ whiteSpace: "nowrap", marginTop: 20 }}
                  variant="contained"
                  type="submit"
                  disabled={
                    // disable when errors, nothing changed or while submitting
                    !!Object.keys(errors).length ||
                    !Object.keys(touched).length ||
                    isSubmitting
                  }
                >
                  Enregistrer
                </Button>
              </Col>
              <Col xs={6} style={{ textAlign: "right" }}>
                <Button
                  style={{
                    marginLeft: 20,
                    whiteSpace: "nowrap",
                    marginTop: 20
                  }}
                  color="danger"
                  type="button"
                  onClick={onDelete}
                >
                  Supprimer
                </Button>
              </Col>
            </Row>
          </StyledForm>
        )}
      />
    </Container>
  </React.Fragment>
);

export default GlossaireForm;
