const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  },

  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  // Inventory endpoints
  inventory: {
    getAll: () => api.request('/inventory'),
    create: (data: any) => api.request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/inventory?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api.request(`/inventory?id=${id}`, { method: 'DELETE' }),
  },

  // Production endpoints
  production: {
    getAll: (from?: string, to?: string) => {
      const params = new URLSearchParams();
      if (from) params.append('from', from);
      if (to) params.append('to', to);
      return api.request(`/production?${params}`);
    },
    create: (data: any) => api.request('/production', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Payroll endpoints
  payroll: {
    getAll: () => api.request('/payroll'),
    create: (data: any) => api.request('/payroll', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/payroll?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Beneficiaries endpoints
  beneficiaries: {
    getAll: () => api.request('/beneficiaries'),
    create: (data: any) => api.request('/beneficiaries', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/beneficiaries?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api.request(`/beneficiaries?id=${id}`, { method: 'DELETE' }),
  },

  // Users endpoints
  users: {
    getAll: () => api.request('/users'),
    create: (data: any) => api.request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/users?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => api.request(`/users?id=${id}`, { method: 'DELETE' }),
  },

  // Daily boxes endpoints
  dailyBoxes: {
    getAll: () => api.request('/daily-boxes'),
    create: (data: any) => api.request('/daily-boxes', { method: 'POST', body: JSON.stringify(data) }),
  },

  // ARB logs endpoints
  arbLogs: {
    getAll: () => api.request('/arb-logs'),
    create: (data: any) => api.request('/arb-logs', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Credits endpoints
  credits: {
    getAll: () => api.request('/credits'),
    create: (data: any) => api.request('/credits', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/credits?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Restock endpoints
  restock: {
    getAll: () => api.request('/restock'),
    create: (data: any) => api.request('/restock', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => api.request(`/restock?id=${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },

  // Stock transactions endpoints
  stockTransactions: {
    getAll: (params?: { from?: string; to?: string; type?: string; item_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.from) query.append('from', params.from);
      if (params?.to) query.append('to', params.to);
      if (params?.type) query.append('type', params.type);
      if (params?.item_id) query.append('item_id', String(params.item_id));
      return api.request(`/stock-transactions?${query}`);
    },
    create: (data: any) => api.request('/stock-transactions', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Finance endpoints
  finance: {
    getAll: () => api.request('/finance'),
    create: (data: any) => api.request('/finance', { method: 'POST', body: JSON.stringify(data) }),
  },

  // Audit logs endpoints
  auditLogs: {
    getAll: () => api.request('/audit-logs'),
  },
};
