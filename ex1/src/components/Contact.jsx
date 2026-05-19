import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
export default function Contact() {
  return (
    <div>
      <h1>Contact Us</h1>
      <Col md={6}>
        <h1 className="display-4 fw-bold text-primary">Contact</h1>
        <p className="lead text-muted">
          Chào mừng bạn đến với ứng dụng của chúng tôi. Chúng tôi cam kết mang
          lại những trải nghiệm tốt nhất thông qua công nghệ hiện đại.
        </p>
        <p>
          Với hơn 5 năm kinh nghiệm trong lĩnh vực phát triển phần mềm, đội ngũ
          của chúng tôi luôn nỗ lực không ngừng để tạo ra các sản phẩm có giá
          trị cao cho cộng đồng.
        </p>
        <Button variant="outline-primary" size="lg">
          Liên lạc ngay hôm nay
        </Button>
      </Col>
      <p>This is the Contact page of our application.</p>
    </div>
  );
}
