// com.test.js
const request = require('superagent')
const expect = require('chai').expect

let api_fix = 'http://localhost:8888/api'

describe('test GET /category', function() {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('public api test start')
  })

  it.skip('should return 200 OK', async function(done) {
    request(api_fix)
      .get('/comment')
      .set('Accept', 'application/json')
      .expect(200, done)
  })

  it.skip('should return 200 OK', async function(done) {
    request(api_fix)
      .post('/comment/post')
      .set('Accept', 'application/json')
      .expect(200, done)
  })
})
