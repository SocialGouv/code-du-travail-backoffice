import React from "react";
import { Container, Row, Col } from "reactstrap";

import { ListRecords } from "./ListRecords";

const Layout = ({ query, records, RightComponent, children }) => (
  <Row>
    {records && (
      <Col xs={3}>
        <ListRecords query={query} records={records} />
      </Col>
    )}
    <Col xs={records ? 9 : 12}>
      <Container>
        {RightComponent && <RightComponent />}
        {children}
      </Container>
    </Col>
  </Row>
);

Layout.defaultProps = {
  RightComponent: null
};

export default Layout;
