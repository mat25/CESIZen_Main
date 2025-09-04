import api from '@/services/axiosClient'

const diagnosticService = {
  getEvents() {
    return api.get('/diagnostic')
  },

  getHistory() {
    return api.get('/diagnostic/me/history')
  },

  submitDiagnostic(payload) {
    return api.post('/diagnostic/submit', payload)
  },

  deleteEvent(id) {
    return api.delete(`/diagnostic/admin/${id}`)
  },

  updateEvent(id, payload) {
    return api.put(`/diagnostic/admin/${id}`, payload)
  },

  getRanges() {
    return api.get('/diagnostic/ranges')
  },

  deleteRange(id) {
    return api.delete(`/diagnostic/ranges/${id}`)
  },

  updateRange(id, payload) {
    return api.put(`/diagnostic/ranges/${id}`, payload)
  },

  createEvent(payload) {
    return api.post('/diagnostic/admin', payload)
  },

  createRange(payload) {
    return api.post('/diagnostic/ranges', payload)
  }

}

export default diagnosticService
