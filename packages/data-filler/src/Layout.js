import React from "react";
import { withRouter } from "next/router";

import { Container, Row, Col } from "reactstrap";

import { ListRecords } from "./ListRecords";

const ListRecordsRouter = withRouter(ListRecords);

const Layout = ({ records, RightComponent, children }) => (
  <Row>
    {records && (
      <Col xs={3}>
        <ListRecordsRouter records={records} />
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
