import { useState } from 'react'
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap'
import './RegistrationForm.css'

export default function RegistrationForm() {
  // State để lưu dữ liệu form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // State để lưu lỗi validation
  const [errors, setErrors] = useState({})

  // State để hiển thị thông báo thành công
  const [successMessage, setSuccessMessage] = useState('')

  /**
   * Xử lý thay đổi giá trị input
   * Cập nhật formData và xóa lỗi của trường đó
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }))
    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }))
    }
  }

  /**
   * Validate dữ liệu form
   * @returns {object} - Object chứa các lỗi (nếu có)
   */
  const validateForm = () => {
    const newErrors = {}

    // Kiểm tra Họ tên không được trống
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống'
    }

    // Kiểm tra Email không được trống
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống'
    } else {
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Email không đúng định dạng'
      }
    }

    // Kiểm tra Mật khẩu không được trống
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống'
    } else if (formData.password.length < 6) {
      // Kiểm tra mật khẩu tối thiểu 6 ký tự
      newErrors.password = 'Mật khẩu tối thiểu 6 ký tự'
    }

    // Kiểm tra Xác nhận mật khẩu không được trống
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống'
    } else if (formData.confirmPassword !== formData.password) {
      // Kiểm tra xác nhận mật khẩu phải trùng với mật khẩu
      newErrors.confirmPassword = 'Xác nhận mật khẩu không trùng với mật khẩu'
    }

    return newErrors
  }

  /**
   * Xử lý submit form
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    // Xóa thông báo thành công trước khi validate
    setSuccessMessage('')

    // Validate form
    const newErrors = validateForm()

    // Nếu có lỗi, lưu lỗi và không submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Nếu không có lỗi, xóa lỗi và hiển thị thông báo thành công
    setErrors({})
    setSuccessMessage(
      `✓ Đăng ký thành công! Chào mừng ${formData.fullName}. Vui lòng kiểm tra email ${formData.email} để xác nhận tài khoản.`
    )

    // Reset form
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    // Tự động xóa thông báo sau 5 giây
    setTimeout(() => {
      setSuccessMessage('')
    }, 5000)
  }

  const errorList = Object.values(errors).filter(Boolean)

  return (
    <Container fluid className="registration-container">
      <Row className="min-vh-100 align-items-center justify-content-center py-5">
        <Col xs={11} sm={9} md={7} lg={5} xl={4}>
          <Card className="registration-card shadow-lg border-0">
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold text-primary">
                Đăng Ký Tài Khoản
              </h2>

              {/* Hiển thị thông báo lỗi tổng quát */}
              {errorList.length > 0 && !successMessage && (
                <Alert variant="danger" className="mb-4">
                  <Alert.Heading>Xin vui lòng sửa các lỗi sau:</Alert.Heading>
                  <ul className="mb-0 ps-3">
                    {errorList.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </Alert>
              )}

              {/* Hiển thị thông báo thành công */}
              {successMessage && (
                <Alert
                  variant="success"
                  dismissible
                  onClose={() => setSuccessMessage('')}
                  className="mb-4"
                >
                  {successMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Trường Họ tên */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ tên của bạn"
                    value={formData.fullName}
                    onChange={handleChange}
                    isInvalid={!!errors.fullName}
                    className="form-control-lg"
                  />
                  {errors.fullName && (
                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                      {errors.fullName}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Trường Email */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    className="form-control-lg"
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Trường Mật khẩu */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    value={formData.password}
                    onChange={handleChange}
                    isInvalid={!!errors.password}
                    className="form-control-lg"
                  />
                  {errors.password && (
                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Trường Xác nhận mật khẩu */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Xác nhận mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    isInvalid={!!errors.confirmPassword}
                    className="form-control-lg"
                  />
                  {errors.confirmPassword && (
                    <Form.Control.Feedback type="invalid" className="d-block mt-2">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Nút Đăng ký */}
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  className="w-100 fw-bold registration-btn"
                >
                  Đăng Ký
                </Button>

                {/* Link đăng nhập */}
                <p className="text-center mt-3 text-muted">
                  Đã có tài khoản?{' '}
                  <a href="#" className="text-primary fw-semibold text-decoration-none">
                    Đăng nhập tại đây
                  </a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
