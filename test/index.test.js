var assert = require('assert')

function formatDate(d) {
  var date1 = new Date(d)
  return (
    date1.getFullYear() +
    '/' +
    (date1.getMonth() + 1) +
    '/' +
    date1.getDate() +
    '  ' +
    date1.getHours() +
    ':' +
    date1.getMinutes() +
    ':' +
    date1.getSeconds()
  )
}

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1, 2, 3].indexOf(4))
    })
  })
})

describe('function test ', function() {
  describe('formatDate()', function() {
    it('should return "2020/1/3  18:8:51" when the value data is 1578046131883', function() {
      assert.equal('2020/1/3  18:8:51', formatDate(1578046131883))
    })
  })
})
