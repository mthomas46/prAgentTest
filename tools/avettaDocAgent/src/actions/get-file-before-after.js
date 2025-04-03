module.exports = {
  getFileBeforeAfter: jest.fn().mockResolvedValue({
    before: 'Test content before',
    after: 'Test content after'
  })
}; 