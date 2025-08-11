module.exports = {
  apps: [
    {
      name: "SSO",
      script: "index.js",
      autorestart: false,
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
