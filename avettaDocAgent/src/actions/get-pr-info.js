module.exports = {
  getPrFiles: jest.fn().mockResolvedValue([
    {
      filename: 'test.ts',
      status: 'modified',
      additions: 1,
      deletions: 1,
      changes: 2
    }
  ])
}; 