import { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Table, Button, Form, Badge,
  Alert, Spinner, Toast, ToastContainer, Row, Col,
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { UserForm } from '../components/UserForm';
import { ConfirmDialog } from '../components/ConfirmDialog';

export function UsersPage() {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterRole) params.role = filterRole;
      const { data } = await userApi.getAll(params);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editUser) {
        await userApi.update(editUser.id, { ...editUser, ...formData });
        showToast('Cập nhật thành công!');
      } else {
        await userApi.create(formData);
        showToast('Thêm người dùng thành công!');
      }
      setShowForm(false);
      setEditUser(null);
      fetchUsers();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userApi.patch(user.id, { status: newStatus });
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u)
      );
      showToast('Trạng thái đã cập nhật.');
    } catch {
      showToast('Cập nhật trạng thái thất bại.', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await userApi.remove(deleteTarget.id);
      showToast(`Đã xóa '${deleteTarget.fullName}' thành công.`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      showToast('Xóa thất bại.', 'error');
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Container
      fluid
      className="py-4 px-4"
      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}
    >
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center bg-white rounded shadow-sm p-3 mb-3">
        <div>
          <h5 className="mb-0 fw-bold">Quản Lý Người Dùng</h5>
          <small className="text-muted">
            Xin chào, {currentUser?.fullName} ({currentUser?.role})
          </small>
        </div>
        <Button variant="danger" onClick={() => { logout(); navigate('/login'); }}>
          Đăng Xuất
        </Button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded shadow-sm p-3 mb-3">
        <Row className="g-2 align-items-center">
          <Col>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên, email, SĐT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <Form.Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ minWidth: '160px' }}
            >
              <option value="">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={() => { setEditUser(null); setShowForm(true); }}>
              + Thêm Người Dùng
            </Button>
          </Col>
        </Row>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted mb-0">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="m-3">{error}</Alert>
        ) : (
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Họ Tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai Trò</th>
                <th>Trạng Thái</th>
                <th>Ngày Tạo</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-4">Không có dữ liệu</td>
                </tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <Badge bg={user.role === 'Admin' ? 'primary' : 'info'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={user.status === 'active' ? 'success' : 'secondary'}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.status === 'active' ? '✓ Active' : '✕ Inactive'}
                      </Button>
                    </td>
                    <td>{user.createdAt}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="me-1"
                        onClick={() => { setEditUser(user); setShowForm(true); }}
                      >
                        ✏️ Sửa
                      </Button>
                      {currentUser?.role === 'Admin' && (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => setDeleteTarget(user)}
                        >
                          🗑️ Xóa
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <UserForm
          user={editUser}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditUser(null); }}
          loading={formLoading}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <ConfirmDialog
          title="Xác Nhận Xóa"
          message={`Bạn có chắc chắn muốn xóa '${deleteTarget.fullName}' không?`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteLoading}
        />
      )}

      {/* Toast */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 2000 }}>
        {toast && (
          <Toast
            bg={toast.type === 'success' ? 'success' : 'danger'}
            show
            autohide
            delay={3000}
            onClose={() => setToast(null)}
          >
            <Toast.Body className="text-white fw-medium">{toast.message}</Toast.Body>
          </Toast>
        )}
      </ToastContainer>
    </Container>
  );
}
