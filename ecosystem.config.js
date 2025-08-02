module.exports = {
  apps: [
    {
      name: 'mapwithgpt-api',
      script: './Api/index.js',
      cwd: '/var/www/mapwithgpt',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      log_file: './logs/api-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G'
    },
    {
      name: 'mapwithgpt-frontend',
      script: 'serve',
      args: '-s build -l 3001',
      cwd: '/var/www/mapwithgpt/GPTMapper',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_file: './logs/frontend-combined.log',
      time: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
