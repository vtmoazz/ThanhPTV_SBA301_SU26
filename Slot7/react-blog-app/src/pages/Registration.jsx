import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './Registration.css';

const initialValues = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const initialErrors = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function Registration() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [submitStatus, setSubmitStatus] = useState('');

  const validate = () => {
    const nextErrors = { ...initialErrors };

    if (!values.fullName.trim()) {
      nextErrors.fullName = 'Họ tên không được để trống.';
    }

    if (!values.email.trim()) {
      nextErrors.email = 'Email không được để trống.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = 'Email không hợp lệ.';
    }

    if (!values.password) {
      nextErrors.password = 'Mật khẩu không được để trống.';
    } else if (values.password.length < 8) {
      nextErrors.password = 'Mật khẩu cần ít nhất 8 ký tự.';
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống.';
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    }

    setErrors(nextErrors);

    return Object.values(nextErrors).every(error => !error);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSubmitStatus('');
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      setSubmitStatus('success');
      setValues(initialValues);
    } else {
      setSubmitStatus('error');
    }
  };

  return (
    <Container className="registration-page py-5">
      <Card className="mx-auto registration-card shadow-sm">
        <Card.Body>
          <h3 className="mb-4">Đăng ký tài khoản</h3>

          {submitStatus === 'success' && (
            <Alert variant='success'>
              Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.
            </Alert>
          )}

          {submitStatus === 'error' && (
            <Alert variant='danger'>
              Vui lòng sửa các lỗi bên dưới trước khi tiếp tục.
            </Alert>
          )}

          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId='fullName' className='mb-3'>
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type='text'
                name='fullName'
                value={values.fullName}
                onChange={handleChange}
                isInvalid={!!errors.fullName}
                placeholder='Nhập họ tên'
              />
              <Form.Control.Feedback type='invalid'>
                {errors.fullName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                name='email'
                value={values.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                placeholder='Nhập email'
              />
              <Form.Control.Feedback type='invalid'>
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type='password'
                name='password'
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
                placeholder='Nhập mật khẩu'
              />
              <Form.Control.Feedback type='invalid'>
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId='confirmPassword' className='mb-4'>
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type='password'
                name='confirmPassword'
                value={values.confirmPassword}
                onChange={handleChange}
                isInvalid={!!errors.confirmPassword}
                placeholder='Nhập lại mật khẩu'
              />
              <Form.Control.Feedback type='invalid'>
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>

            <div className='d-grid'>
              <Button type='submit' variant='primary'>
                Đăng ký
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Registration;
