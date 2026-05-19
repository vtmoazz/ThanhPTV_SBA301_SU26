import React, { useState } from 'react';
import { Row, Col, Container, Card, Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { OrchidsData } from '../shared/ListOfOrchids';

export default function Orchids() {
  const [show, setShow] = useState(false);
  const [selectedOrchid, setSelectedOrchid] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (orchid) => {
    setSelectedOrchid(orchid);
    setShow(true);
  };

  return (
    <Container className="my-4">
      <div className="section-title mb-4">
        <span>Our Collection</span>
        <h2>Fresh orchids for your space</h2>
      </div>
      <Row>
        {OrchidsData.map((orchid) => (
          <Col md={3} key={orchid.id} className="mb-4">
            <Card className="orchid-card h-100">
              <div className="orchid-img-wrap">
                <Card.Img
                  variant="top"
                  src={orchid.image.startsWith("/") ? orchid.image : `/${orchid.image}`}
                  className="orchid-img"
                />
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title>{orchid.orchidName}</Card.Title>
                <Card.Text>{orchid.category}</Card.Text>
                {orchid.isSpecial && (
                  <span className="special-badge position-absolute top-0 end-0 m-2 px-3 py-1 bg-danger text-white rounded-pill shadow">
                    Đặc biệt
                  </span>
                )}
                <p className="text-muted">Price: {orchid.price?.toLocaleString()} VND</p>
                <Button
                  variant="primary"
                  className="mt-auto"
                  onClick={() => handleShow(orchid)}
                >
                  Detail
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedOrchid ? selectedOrchid.orchidName : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrchid ? (
            <div>
              <img
                src={selectedOrchid.image.startsWith("/") ? selectedOrchid.image : `/${selectedOrchid.image}`}
                alt={selectedOrchid.orchidName}
                style={{ width: '100%' }}
                className="mb-3"
              />
              <p><strong>ID:</strong> {selectedOrchid.id}</p>
              <p><strong>Category:</strong> {selectedOrchid.category}</p>
              <p><strong>Price:</strong> {selectedOrchid.price?.toLocaleString()} VND</p>
              <p><strong>Special:</strong> {selectedOrchid.isSpecial ? 'Yes' : 'No'}</p>
              <p>{selectedOrchid.description}</p>
            </div>
          ) : (
            <p>Loading details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
