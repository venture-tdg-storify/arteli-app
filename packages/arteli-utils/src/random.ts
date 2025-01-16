export const random = {
  get String() {
    return Math.random().toString(36).substring(7)
  },

  get Number() {
    return Math.floor(random.Float)
  },

  get Float() {
    return Math.random() * 10000
  },

  get ISODate() {
    return new Date().toISOString()
  }
}
