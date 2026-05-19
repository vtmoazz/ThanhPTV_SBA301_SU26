import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';

function Footer({ avatar, name, email }) {
    return (
        <footer className="site-footer">
        <Container>
            <Row className="align-items-center g-3">
                <Col md={4} className="footer-author">
                    <Image src={avatar} alt={name} className="footer-avatar" />
                    <div>
                        <h5>Orchid Shop</h5>
                        <small>Created by {name}</small>
                    </div>
                </Col>
                <Col md={4} className="footer-copy">
                    <small>All rights reserved 2026.</small>
                </Col>
                <Col md={4} className="footer-contact">
                    <a href={`mailto:${email}`}>{email}</a>
                </Col>
            </Row>
        </Container>
        </footer>
    );
}   
export default Footer;
