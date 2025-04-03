module.exports = {
  analyzeCodeChanges: jest.fn().mockResolvedValue({
    overview: 'Test overview',
    comments: [
      {
        file: 'test.ts',
        line: '1',
        comment: 'Test comment'
      }
    ]
  })
}; 