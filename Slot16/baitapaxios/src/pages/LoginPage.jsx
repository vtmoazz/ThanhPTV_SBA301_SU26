import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export function LoginPage() {
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!username.trim()) {
      e.username = 'Tên đăng nhập không được để trống.';
    } else if (username.trim().length < 3) {
      e.username = 'Tên đăng nhập phải có ít nhất 3 ký tự.';
    }
    if (!password) {
      e.password = 'Mật khẩu không được để trống.';
    } else if (password.length < 6) {
      e.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    setFieldErrors({});
    const success = await login(username, password);
    if (success) navigate('/');
  };

  const clearFieldError = (field) => {
    if (fieldErrors[field]) setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: '420px' }} className="shadow">
        <Card.Body className="p-4">
          <h2 className="text-center mb-1">Đăng Nhập</h2>
          <p className="text-center text-muted mb-4">User Manager Application</p>

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearFieldError('username'); }}
                placeholder="Nhập tên đăng nhập"
                disabled={loading}
                isInvalid={!!fieldErrors.username}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.username}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }}
                placeholder="Nhập mật khẩu"
                disabled={loading}
                isInvalid={!!fieldErrors.password}
              />
              <Form.Control.Feedback type="invalid">
                {fieldErrors.password}
              </Form.Control.Feedback>
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <Button type="submit" variant="primary" className="w-100" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
            </Button>
          </Form>

          <div className="bg-light rounded p-3 mt-3">
            <p className="mb-1 fw-bold">Demo Account:</p>
            <p className="mb-1 small text-muted">admin / 123456 (Admin)</p>
            <p className="mb-0 small text-muted">user / 123456 (User)</p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
