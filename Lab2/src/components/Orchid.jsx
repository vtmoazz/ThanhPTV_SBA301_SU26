import { Component } from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

class Orchid extends Component {
  renderCard() {
    const { orchid, onDetail } = this.props;
    const imageSrc = orchid.image.startsWith("/") ? orchid.image : `/${orchid.image}`;

    return (
      <Card className="orchid-card">
        <div className="orchid-img-wrap">
          <Card.Img variant="top" src={imageSrc} className="orchid-img" />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title>{orchid.orchidName}</Card.Title>
          <p>Id: {orchid.id}</p>
          <Card.Text>Category: {orchid.category}</Card.Text>
          {orchid.isSpecial && (
            <span className="special-badge position-absolute top-0 end-0 m-2 px-3 py-1 bg-danger text-white rounded-pill shadow">
              Đặc biệt
            </span>
          )}
          <p>Price: {orchid.price}</p>
          <div className="d-flex justify-content-center mt-auto gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => (onDetail ? onDetail(orchid) : null)}
            >
              Detail
            </Button>
            <Button variant="primary" size="sm">
              Buy Now
            </Button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  renderDetail(orchid) {
    if (!orchid) {
      return (
        <div style={{ padding: "2rem" }}>
          <h3>Không tìm thấy hoa lan</h3>
          <Button as={Link} to="/orchid" variant="primary">
            Quay lại
          </Button>
        </div>
      );
    }

    return (
      <div className="orchid-page" style={{ padding: "2rem" }}>
        <Card
          className="orchid-card"
          style={{ maxWidth: 900, margin: "0 auto" }}
        >
          <Card.Img variant="top" src={orchid.image} alt={orchid.orchidName} />
          <Card.Body>
            <Card.Title>{orchid.orchidName}</Card.Title>
            <Card.Text>{orchid.description}</Card.Text>
            <div className="orchid-info">
              <p>
                <strong>Danh mục:</strong> {orchid.category}
              </p>
              <p>
                <strong>Giá:</strong> {orchid.price}
              </p>
            </div>
            {orchid.isSpecial && (
              <span className="special-badge">Đặc biệt</span>
            )}
            <div style={{ marginTop: "1rem" }}>
              <Button as={Link} to="/orchid" variant="outline-primary">
                Quay lại bộ sưu tập
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  }

  render() {
    const { orchid } = this.props;
    if (orchid) return this.renderCard();

    // No orchid prop passed — show not found message
    return (
      <div style={{ padding: "2rem" }}>
        <h3>Không tìm thấy hoa lan</h3>
        <Button as={Link} to="/orchid" variant="primary">
          Quay lại
        </Button>
      </div>
    );
  }
}

export default Orchid;

