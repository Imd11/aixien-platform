module.exports = {
  apps: [{
    name: 'aixien-platform',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/aixien-platform',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      // Increase Node.js memory limit
      NODE_OPTIONS: '--max-old-space-size=2048'
    },
    // PM2 timeout settings
    kill_timeout: 120000,  // 120 seconds
    wait_ready: true,
    listen_timeout: 120000,  // 120 seconds
    
    // Error handling
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Advanced PM2 settings
    exec_mode: 'fork',
    min_uptime: '10s',
    max_restarts: 10,
  }]
};