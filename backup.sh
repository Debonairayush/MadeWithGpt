#!/bin/bash
# MapWithGPT Backup Script

# Configuration
BACKUP_DIR="/var/backups/mapwithgpt"
PROJECT_DIR="/var/www/mapwithgpt"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="mapwithgpt_backup_$DATE.tar.gz"
RETENTION_DAYS=7

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Create backup
echo "Creating backup: $BACKUP_FILE"
tar -czf "$BACKUP_DIR/$BACKUP_FILE" \
    --exclude="node_modules" \
    --exclude=".git" \
    --exclude="logs" \
    --exclude="*.log" \
    -C $(dirname $PROJECT_DIR) $(basename $PROJECT_DIR)

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"
    
    # Remove old backups (older than RETENTION_DAYS)
    find $BACKUP_DIR -name "mapwithgpt_backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up (retention: $RETENTION_DAYS days)"
else
    echo "Backup failed!"
    exit 1
fi

# List current backups
echo "Current backups:"
ls -la $BACKUP_DIR/mapwithgpt_backup_*.tar.gz 2>/dev/null || echo "No backups found"
