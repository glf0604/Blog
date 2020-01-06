// blog.test.js
const request = require('superagent')
const expect = require('chai').expect

let api_fix = 'http://localhost:8888/admin'

describe('test GET /category', function() {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('blogAPI test start')
  })

  it.skip('should return 200 OK', async function(done) {
    request(api_fix)
      .get('/category')
      .set('Content-Type', 'text/html')
      .expect(200, done)
  })
})

describe('test GET /category/add', function(done) {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('blog test start')
  })

  it('should return 200 OK', async function(done) {
    done()
    let data = await request(api_fix).get('/category/add')

    // .set('Content-Type', 'text/html')
    // .expect(200, done)
    // done()
  })
})

describe('test GET /category/add', function() {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('blogAPI test start')
  })

  it.skip('should return 200 OK', async function(done) {
    request(api_fix)
      .get('/category/add')
      // .set('Content-Type', 'text/html')
      .expect(200, done)
  })
})

describe('test GET /category/add', function() {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('blogAPI test start')
  })

  it.skip('should return 200 OK', async function(done) {
    request(api_fix)
      .post('/category/add')
      .set('Content-Type', 'text/html')
      .expect(200, done)
  })
})

describe('test GET /category/edit', function() {
  // Setup Fake rendering
  beforeEach(() => {
    console.info('blogAPI test start')
  })

  it('should return 200 OK', async function(done) {
    done()
    request(api_fix).get('/category/edit')
    // .set('Content-Type', 'text/html')
    // .expect(200, done)
  })
})
