Bài Tập Thực Hành
CRUD với Axios & json-server
trong ReactJS
Đăng nhập • Hiển thị bảng • Thêm • Sửa • Xóa • Lọc • Tìm kiếm
Môn học: SBA301 – ReactJS
Công cụ: React 18 • Vite • Axios • json-server

# PHẦN 1: TỔNG QUAN BÀI TẬP
## 1.1. Mô tả
Xây dựng ứng dụng quản lý người dùng (User Manager) với đầy đủ chức năng đăng nhập và CRUD, sử dụng React + Axios gọi đến json-server như một REST API giả lập. Mọi thay đổi (thêm/sửa/xóa) được ghi thẳng vào file db.json.

## 1.2. Cấu trúc dự án
BaiTapAxios/
├── db.json                    ← Dữ liệu (json-server đọc file này)
├── package.json
├── vite.config.js
├── index.html
└── src/
├── main.jsx
├── App.jsx                ← Router đơn giản (Login / Users)
├── api/
│   ├── axiosInstance.js   ← Axios instance + interceptors
│   └── userApi.js         ← Tất cả hàm gọi API
├── context/
│   └── AuthContext.jsx    ← Quản lý đăng nhập toàn app
├── components/
│   ├── UserForm.jsx       ← Modal thêm/sửa (có validation)
│   └── ConfirmDialog.jsx  ← Hộp thoại xác nhận xóa
└── pages/
├── LoginPage.jsx      ← Trang đăng nhập
└── UsersPage.jsx      ← Bảng CRUD chính

## 1.3. Tài khoản đăng nhập mẫu

## 1.4. Luồng hoạt động
App khởi động
→ AuthContext kiểm tra localStorage
→ Nếu có session → UsersPage
→ Nếu không → LoginPage

LoginPage
→ Nhập username/password
→ authApi.login() gọi GET /accounts?username=&password=
→ Nếu tìm thấy → lưu session vào localStorage + state
→ Redirect sang UsersPage

UsersPage
→ Fetch GET /users khi mount
→ Hiển thị bảng, tìm kiếm client-side
→ Mỗi action (thêm/sửa/xóa) gọi API → cập nhật db.json


# PHẦN 2: CÀI ĐẶT VÀ KHỞI ĐỘNG
## Bước 1 – Cài dependencies
# Mở terminal, cd vào thư mục BaiTapAxios
cd BaiTapAxios

# Cài tất cả package
npm install

# Các package được cài:
# - axios           : HTTP client
# - react, react-dom: UI framework
# - json-server     : REST API giả lập từ db.json
# - vite            : build tool, dev server
# - concurrently    : chạy 2 lệnh cùng lúc

## Bước 2 – Khởi động dự án
# Chạy CẢ HAI server cùng lúc (khuyến nghị)
npm start

# Hoặc chạy riêng lẻ trong 2 terminal:
# Terminal 1 – json-server (REST API port 3001)
npm run server

# Terminal 2 – Vite dev server (React app port 5173)
npm run dev
⚠  json-server chạy trên cổng 3001. React app chạy trên cổng 5173. Cả hai phải cùng chạy để app hoạt động.

## Bước 3 – Kiểm tra json-server
# Mở browser, thử các endpoint:
http://localhost:3001/users          → Danh sách tất cả users
http://localhost:3001/users/1        → User có id=1
http://localhost:3001/accounts       → Danh sách tài khoản
http://localhost:3001/users?role=Admin → Lọc theo role


# PHẦN 3: AXIOS INSTANCE VÀ API LAYER
## 3.1. axiosInstance.js – Cấu hình trung tâm
Thay vì import axios và gõ baseURL mỗi file, ta tạo một instance dùng chung:
// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
baseURL: 'http://localhost:3001',  // json-server
timeout: 8000,                     // hủy sau 8 giây
headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: tự gắn token
api.interceptors.request.use(config => {
const token = localStorage.getItem('auth_token');
if (token) config.headers.Authorization = `Bearer ${token}`;
return config;
});

// Response interceptor: xử lý lỗi tập trung
api.interceptors.response.use(
response => response,
error => {
if (error.response?.status === 401) {
localStorage.clear();
window.location.href = '/';
}
return Promise.reject(error);
}
);

export default api;

## 3.2. userApi.js – Các hàm gọi API
// src/api/userApi.js
import api from './axiosInstance';

export const authApi = {
login: async (username, password) => {
const { data: accounts } = await api.get('/accounts', {
params: { username, password },   // ?username=...&password=...
});
if (accounts.length === 0)
throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
const account = accounts[0];
const { data: user } = await api.get(`/users/${account.userId}`);
return { account, user };
},
};

export const userApi = {
getAll:  (params={}) => api.get('/users', { params }),
getById: (id)        => api.get(`/users/${id}`),
create:  (data)      => api.post('/users', {
...data, createdAt: new Date().toISOString().split('T')[0]
}),
update:  (id, data)  => api.put(`/users/${id}`, data),
patch:   (id, part)  => api.patch(`/users/${id}`, part),
remove:  (id)        => api.delete(`/users/${id}`),
};
⚠  json-server hỗ trợ GET /users?role=Admin, GET /users?_limit=5&_page=1. Params được Axios tự build thành query string.


# PHẦN 4: AUTHENTICATION – AuthContext
## 4.1. Luồng đăng nhập
LoginPage                         AuthContext                       json-server
│                                 │                                 │
│─── login(username, pw) ────────>│                                 │
│                                 │── GET /accounts?username=... ──>│
│                                 │<── [{ id, userId, role }] ──────│
│                                 │── GET /users/{userId} ──────────>│
│                                 │<── { id, fullName, email... } ───│
│                                 │── setCurrentUser(session)        │
│                                 │── localStorage.setItem(...)      │
│<── currentUser != null ─────────│                                 │
│── render UsersPage              │                                 │

## 4.2. AuthContext – Code chính
// src/context/AuthContext.jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [currentUser, setCurrentUser] = useState(null);
const [loading, setLoading] = useState(false);
const [error,   setError]   = useState('');

// Khôi phục session khi app khởi động
useEffect(() => {
const saved = localStorage.getItem('current_user');
if (saved) setCurrentUser(JSON.parse(saved));
}, []);

const login = async (username, password) => {
setLoading(true); setError('');
try {
const { account, user } = await authApi.login(username, password);
const session = { ...user, role: account.role };
setCurrentUser(session);
localStorage.setItem('current_user', JSON.stringify(session));
return true;
} catch (err) {
setError(err.message);
return false;
} finally {
setLoading(false);
}
};

const logout = () => {
setCurrentUser(null);
localStorage.clear();
};

return (
<AuthContext.Provider value={{ currentUser, loading, error, login, logout }}>
{children}
</AuthContext.Provider>
);
}


# PHẦN 5: USERS PAGE – CRUD STEP-BY-STEP
## 5.1. Bước 1 – Khai báo state
// src/pages/UsersPage.jsx
const [users,       setUsers]       = useState([]);
const [loading,     setLoading]     = useState(true);
const [error,       setError]       = useState(null);
const [search,      setSearch]      = useState('');
const [filterRole,  setFilterRole]  = useState('');
const [showForm,    setShowForm]    = useState(false);
const [editUser,    setEditUser]    = useState(null);  // null = thêm mới
const [deleteTarget,setDeleteTarget]= useState(null);
const [toast,       setToast]       = useState(null);

## 5.2. Bước 2 – GET /users (Read)
const fetchUsers = useCallback(async () => {
setLoading(true); setError(null);
try {
const params = {};
if (filterRole) params.role = filterRole;  // lọc phía server
const { data } = await userApi.getAll(params);
setUsers(data);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
}, [filterRole]);

useEffect(() => { fetchUsers(); }, [fetchUsers]);
// Khi filterRole thay đổi → fetchUsers chạy lại → GET với params mới

## 5.3. Bước 3 – Tìm kiếm client-side
// Lọc trên data đã có trong state (không gọi API thêm)
const filtered = users.filter(u =>
u.fullName.toLowerCase().includes(search.toLowerCase()) ||
u.email.toLowerCase().includes(search.toLowerCase())   ||
u.phone.includes(search)
);

// Render filtered thay vì users
filtered.map(user => <tr key={user.id}>...</tr>)

## 5.4. Bước 4 – POST /users (Create)
const handleSubmit = async (formData) => {
setFormLoading(true);
try {
if (editUser) {
// PUT – cập nhật toàn bộ
await userApi.update(editUser.id, { ...editUser, ...formData });
showToast('Cập nhật thành công!');
} else {
// POST – thêm mới
await userApi.create(formData);
showToast('Thêm người dùng thành công!');
}
setShowForm(false);
fetchUsers(); // reload bảng từ server
} catch (err) {
setFormError(err.message);
} finally {
setFormLoading(false);
}
};

## 5.5. Bước 5 – PATCH /users/:id (Toggle Status)
const handleToggleStatus = async (user) => {
const newStatus = user.status === 'active' ? 'inactive' : 'active';
try {
// PATCH chỉ gửi field cần cập nhật
await userApi.patch(user.id, { status: newStatus });

// Optimistic update: cập nhật UI ngay, không cần gọi fetchUsers()
setUsers(prev =>
prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u)
);
} catch (err) {
showToast('Cập nhật trạng thái thất bại.', 'error');
}
};

## 5.6. Bước 6 – DELETE /users/:id (Delete)
// Khi click nút xóa → hiện ConfirmDialog
const handleDeleteConfirm = async () => {
try {
await userApi.remove(deleteTarget.id);
showToast(`Đã xóa '${deleteTarget.fullName}' thành công.`);
setDeleteTarget(null);
fetchUsers(); // reload từ server
} catch (err) {
showToast('Xóa thất bại.', 'error');
setDeleteTarget(null);
}
};
⚠  Chỉ role Admin mới thấy nút xóa: {currentUser?.role === 'Admin' && <button onClick={...}>🗑</button>}


# PHẦN 6: USERFORM – VALIDATION
## 6.1. Logic validate
const validate = () => {
const e = {};
if (!form.fullName.trim())         e.fullName = 'Họ tên không được để trống.';
else if (form.fullName.length < 3) e.fullName = 'Họ tên phải có ít nhất 3 ký tự.';
if (!form.email.trim())
e.email = 'Email không được để trống.';
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
e.email = 'Email không hợp lệ.';
if (!form.phone.trim())
e.phone = 'Số điện thoại không được để trống.';
else if (!/^0\d{9}$/.test(form.phone))
e.phone = 'Số điện thoại phải 10 chữ số, bắt đầu bằng 0.';
return e;
};

const handleSubmit = (e) => {
e.preventDefault();
const errors = validate();
if (Object.keys(errors).length > 0) { setErrors(errors); return; }
onSubmit(form);  // gọi handler từ UsersPage
};

## 6.2. Điền data khi chỉnh sửa
// useEffect chạy khi prop 'user' thay đổi
useEffect(() => {
if (user) {
// Chế độ Edit: điền data user vào form
setForm({ fullName: user.fullName, email: user.email,
phone: user.phone, role: user.role, status: user.status });
} else {
// Chế độ Add: reset về empty
setForm(emptyForm);
}
setErrors({});
}, [user]);


# PHẦN 7: CẤU TRÚC db.json
## 7.1. Schema
{
"users": [
{
"id": 1,
"fullName": "Nguyễn Văn An",
"email": "an.nguyen@example.com",
"phone": "0901234567",
"role": "Admin",
"status": "active",
"createdAt": "2024-01-10"
},
{ ... }
],
"accounts": [
{
"id": 1,
"username": "admin",
"password": "123456",
"userId": 1,     ← liên kết với users[id=1]
"role": "Admin"
}
]
}
⚠  json-server tự động tạo REST endpoints: GET/POST /users, GET/PUT/PATCH/DELETE /users/:id. Mọi thay đổi được ghi thẳng vào db.json.

## 7.2. Các endpoint json-server tự tạo


# PHẦN 8: TỔNG KẾT VÀ MỞ RỘNG
## Checklist hoàn thành bài tập
json-server khởi động và trả data từ db.json.
Đăng nhập đúng tài khoản, sai hiện thông báo lỗi.
Reload trang vẫn giữ session (localStorage).
Bảng hiển thị đúng danh sách users từ GET /users.
Tìm kiếm theo tên / email / SĐT hoạt động.
Lọc theo vai trò gọi API với params.
Thêm user: form validate, POST thành công, bảng cập nhật.
Sửa user: form điền sẵn data, PUT thành công.
Toggle status: PATCH ngay, UI cập nhật (optimistic).
Xóa user: hiện confirm dialog, DELETE thành công.
Phân quyền: chỉ Admin thấy nút Xóa.
Toast notification sau mỗi action.

## Gợi ý mở rộng
Phân trang (pagination): GET /users?_page=1&_limit=5
Sắp xếp: GET /users?_sort=fullName&_order=asc
Hash password: Dùng bcryptjs để không lưu plaintext.
React Query: Thay useEffect + fetch bằng useQuery/useMutation.
Form library: Dùng React Hook Form + Zod thay validate thủ công.
Protected route: Tách riêng PrivateRoute component.
