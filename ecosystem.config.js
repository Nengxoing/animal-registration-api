module.exports = {
    apps: [
        {
            name: 'animal-registration',
            script: './dist/index.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            merge_logs: true
        }
    ]
};
