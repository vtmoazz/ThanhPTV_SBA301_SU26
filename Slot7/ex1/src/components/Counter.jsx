import { useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import './Counter.css'

/**
 * Counter App Component
 * Quản lý state count và cung cấp các nút Tăng, Giảm, Reset
 */
export default function Counter() {
  // State để lưu giá trị count (mặc định là 0)
  const [count, setCount] = useState(0)

  /**
   * Hàm tăng count lên 1
   */
  const handleIncrease = () => {
    setCount(count + 1)
  }

  /**
   * Hàm giảm count xuống 1 nhưng không cho phép nhỏ hơn 0
   */
  const handleDecrease = () => {
    setCount((currentCount) => Math.max(currentCount - 1, 0))
  }

  /**
   * Hàm đưa count về 0
   */
  const handleReset = () => {
    setCount(0)
  }

  return (
    <Container
      fluid
      className="counter-container min-vh-100 d-flex align-items-center justify-content-center py-5"
    >
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card className="counter-card border-0 shadow-lg">
            <Card.Body className="p-5 text-center">
              {/* Tiêu đề */}
              <Card.Title as="h1" className="fw-bold mb-4 counter-title">
                📊 Counter App
              </Card.Title>

              {/* Mô tả */}
              <Card.Text className="text-muted mb-4 counter-description">
                Quản lý bộ đếm của bạn
              </Card.Text>

              {/* Hiển thị giá trị count */}
              <div className="counter-display mb-5">
                <div className="counter-value">{count}</div>
              </div>

              {/* Nhóm các nút */}
              <Row className="g-3">
                {/* Nút Tăng */}
                <Col xs={12} sm={4}>
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 counter-btn fw-bold"
                    onClick={handleIncrease}
                  >
                    ⬆️ Tăng
                  </Button>
                </Col>

                {/* Nút Giảm */}
                <Col xs={12} sm={4}>
                  <Button
                    variant="danger"
                    size="lg"
                    className="w-100 counter-btn fw-bold"
                    onClick={handleDecrease}
                    disabled={count === 0}
                  >
                    ⬇️ Giảm
                  </Button>
                </Col>

                {/* Nút Reset */}
                <Col xs={12} sm={4}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-100 counter-btn fw-bold"
                    onClick={handleReset}
                  >
                    🔄 Reset
                  </Button>
                </Col>
              </Row>

              {/* Thông tin thêm */}
              <div className="mt-4 pt-4 border-top counter-info">
                <small className="text-muted">
                  Giá trị hiện tại: <strong className="text-primary">{count}</strong>
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}