import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

export function UserForm({ user, onSubmit, onCancel, loading = false }) {
  const emptyForm = { fullName: '', email: '', phone: '', role: 'User', status: 'active' };

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [user]);

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email không được để trống.';

    // Ký tự đặc biệt không hợp lệ trong email
    if (/[\s<>()\[\]\\,;:"']/.test(email))
      return 'Email chứa ký tự đặc biệt không hợp lệ (< > ( ) [ ] \\ , ; : " \').';

    // Phải có đúng một @
    const parts = email.split('@');
    if (parts.length !== 2) return 'Email phải có đúng một ký tự @.';

    const [local, domain] = parts;

    // Kiểm tra phần local (trước @)
    if (!local) return 'Phần tên người dùng không được để trống.';
    if (local.startsWith('.') || local.endsWith('.'))
      return 'Email không được bắt đầu hoặc kết thúc bằng dấu chấm trước @.';
    if (/\.\./.test(local))
      return 'Email không được có 2 dấu chấm liên tiếp.';
    if (!/^[a-zA-Z0-9._%+\-]+$/.test(local))
      return 'Phần tên người dùng chỉ được chứa chữ, số và . _ % + -';

    // Kiểm tra phần domain (sau @)
    if (!domain || !domain.includes('.'))
      return 'Tên miền email không hợp lệ (ví dụ: gmail.com).';
    if (domain.startsWith('.') || domain.startsWith('-'))
      return 'Tên miền email không hợp lệ.';
    if (!/^[a-zA-Z0-9.-]+$/.test(domain))
      return 'Tên miền chỉ được chứa chữ, số, dấu chấm và gạch ngang.';
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2 || !/^[a-zA-Z]+$/.test(tld))
      return 'Phần mở rộng tên miền không hợp lệ (ví dụ: .com, .vn).';

    return null;
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Họ tên không được để trống.';
    else if (form.fullName.trim().length < 3) e.fullName = 'Họ tên phải có ít nhất 3 ký tự.';

    const emailErr = validateEmail(form.email.trim());
    if (emailErr) e.email = emailErr;

    if (!form.phone.trim()) e.phone = 'Số điện thoại không được để trống.';
    else if (!/^0\d{9}$/.test(form.phone)) e.phone = 'Số điện thoại phải 10 chữ số, bắt đầu bằng 0.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <Modal show onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{user ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}</Modal.Title>
      </Modal.Header>

      <Form noValidate onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Họ tên *</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              isInvalid={!!errors.fullName}
            />
            <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email *</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại *</Form.Label>
            <Form.Control
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>Hủy</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
