module.exports = {
  apps: [
    {
      name: 'oraconmigo',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
