import api from "./api";

export const caseService = {
  async createCase(formData) {
    const { data } = await api.post("/cases", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  async getCases() {
    const { data } = await api.get("/cases");
    return data;
  },

  async getCaseById(id) {
    const { data } = await api.get(`/cases/${id}`);
    return data;
  },

  async updateCase(id, updates) {
    const { data } = await api.put(`/cases/${id}`, updates);
    return data;
  },

  async deleteCase(id) {
    const { data } = await api.delete(`/cases/${id}`);
    return data;
  },

  async assignCase(id, assignedTo) {
    const { data } = await api.put(`/cases/assign/${id}`, { assignedTo });
    return data;
  },
};
