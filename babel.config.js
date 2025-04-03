module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      loose: true,
    }],
  ],
  plugins: [
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
  ],
}; 