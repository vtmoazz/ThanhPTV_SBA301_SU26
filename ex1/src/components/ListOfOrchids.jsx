import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import Orchid from "./Orchid";

export default function ListOfOrchids({ orchidsData }) {
  const [show, setShow] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = (orchid) => {
    setSelectedOrchid(orchid);
    setShow(true);
  };

  return (
    <Container fluid className="orchid-section">
      <div className="section-title">
        <span>Our Collection</span>
        <h2>Fresh orchids for your space</h2>
      </div>
      <Row className="g-4">
        {orchidsData.map((orchid) => (
          <Col xs={12} sm={6} lg={3} className="d-flex" key={orchid.id}>
            <Orchid orchid={orchid} onDetail={handleShow} />
          </Col>
        ))}
      </Row>
      <ConfirmModal
        show={show}
        handleClose={handleClose}
        title={selectedOrchid?.orchidName}
        body={
          <div>
            <img
              src={selectedOrchid?.image}
              alt={selectedOrchid?.orchidName}
              className="img-fluid mb-3"
            />
            <p>ID: {selectedOrchid?.id}</p>
            <p>Category: {selectedOrchid?.category}</p>
            <p>Price: {selectedOrchid?.price}</p>
            <p>Description: {selectedOrchid?.description}</p>
          </div>
        }
        onConfirm={handleClose}
      />
    </Container>
  );
}
