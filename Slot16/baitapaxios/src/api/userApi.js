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
