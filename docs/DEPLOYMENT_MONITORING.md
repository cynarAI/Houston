# 📊 Deployment Monitoring & Best Practices

**Version**: 1.0  
**Datum**: 2025-12-03  
**Status**: ✅ Empfohlen

---

## 🎯 Empfehlungen

### 1. Monitoring: Kontinuierliches Monitoring für den Prozess

**Ziel**: Überwache den Deployment-Prozess und die App-Performance kontinuierlich.

**Implementierung**:

```bash
# Monitoring-Script erstellen
cat > /usr/local/bin/monitor-houston.sh << 'EOF'
#!/bin/bash
# Houston Deployment Monitoring Script

LOG_FILE="/var/log/houston-monitoring.log"
DEPLOY_LOG="/var/log/houston-deployment.log"
SITE_URL="https://houston.manus.space"

# Prüfe ob Seite erreichbar ist
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL")
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

if [ "$HTTP_CODE" != "200" ]; then
  echo "[MONITOR] $TIMESTAMP - WARNUNG: HTTP $HTTP_CODE für $SITE_URL" | tee -a "$LOG_FILE"
fi

# Prüfe ob Deployment-Log aktualisiert wurde (letzte 24h)
if [ -f "$DEPLOY_LOG" ]; then
  LAST_DEPLOY=$(stat -c %Y "$DEPLOY_LOG" 2>/dev/null || stat -f %m "$DEPLOY_LOG" 2>/dev/null)
  NOW=$(date +%s)
  AGE=$((NOW - LAST_DEPLOY))

  if [ $AGE -gt 86400 ]; then
    echo "[MONITOR] $TIMESTAMP - INFO: Kein Deployment in den letzten 24h" | tee -a "$LOG_FILE"
  fi
fi

# Prüfe Disk-Space für /var/www/html
DISK_USAGE=$(df -h /var/www/html | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
  echo "[MONITOR] $TIMESTAMP - WARNUNG: Disk-Space bei ${DISK_USAGE}%" | tee -a "$LOG_FILE"
fi
EOF

chmod +x /usr/local/bin/monitor-houston.sh

# Cron-Job einrichten (alle 5 Minuten)
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-houston.sh") | crontab -
```

**Monitoring-Tools**:

- **Uptime Monitoring**: Externe Services wie UptimeRobot, Pingdom
- **Error Tracking**: Sentry (bereits integriert)
- **Performance Monitoring**: Plausible Analytics (bereits integriert)
- **Log Aggregation**: ELK Stack, Loki, oder CloudWatch

---

### 2. Logs: Log-Rotation für /var/log/houston-deployment.log

**Ziel**: Verhindere, dass Log-Dateien zu groß werden und Speicherplatz belegen.

**Implementierung**:

```bash
# Logrotate-Konfiguration erstellen
cat > /etc/logrotate.d/houston-deployment << 'EOF'
/var/log/houston-deployment.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
    sharedscripts
    postrotate
        # Optional: Benachrichtigung bei Rotation
        echo "Houston deployment log rotated" | logger -t houston-deployment
    endscript
}

/var/log/houston-monitoring.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0644 root root
}
EOF

# Test Logrotate-Konfiguration
logrotate -d /etc/logrotate.d/houston-deployment

# Manuelle Rotation testen
logrotate -f /etc/logrotate.d/houston-deployment
```

**Log-Rotation-Einstellungen**:

- **Deployment-Log**: Täglich rotieren, 30 Tage aufbewahren
- **Monitoring-Log**: Täglich rotieren, 14 Tage aufbewahren
- **Komprimierung**: Nach 1 Tag komprimieren (delaycompress)
- **Berechtigungen**: 0644, root:root

---

### 3. Backup: Regelmäßige Backups von /var/www/html

**Ziel**: Automatische Backups für schnelles Rollback und Disaster Recovery.

**Implementierung**:

```bash
# Backup-Script erstellen
cat > /usr/local/bin/backup-houston.sh << 'EOF'
#!/bin/bash
# Houston Deployment Backup Script

BACKUP_DIR="/var/backups/houston"
SOURCE_DIR="/var/www/html"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="houston-backup-${TIMESTAMP}.tar.gz"
LOG_FILE="/var/log/houston-backup.log"

# Erstelle Backup-Verzeichnis falls nicht vorhanden
mkdir -p "$BACKUP_DIR"

# Erstelle Backup
echo "[BACKUP] $(date -u +%Y-%m-%dT%H:%M:%SZ) - Starte Backup..." | tee -a "$LOG_FILE"

tar -czf "${BACKUP_DIR}/${BACKUP_NAME}" -C "$(dirname $SOURCE_DIR)" "$(basename $SOURCE_DIR)" 2>&1 | tee -a "$LOG_FILE"

if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}" | cut -f1)
  echo "[BACKUP] $(date -u +%Y-%m-%dT%H:%M:%SZ) - Backup erfolgreich: ${BACKUP_NAME} (${BACKUP_SIZE})" | tee -a "$LOG_FILE"

  # Lösche alte Backups (älter als 30 Tage)
  find "$BACKUP_DIR" -name "houston-backup-*.tar.gz" -mtime +30 -delete
  echo "[BACKUP] $(date -u +%Y-%m-%dT%H:%M:%SZ) - Alte Backups gelöscht (>30 Tage)" | tee -a "$LOG_FILE"
else
  echo "[BACKUP] $(date -u +%Y-%m-%dT%H:%M:%SZ) - FEHLER: Backup fehlgeschlagen!" | tee -a "$LOG_FILE"
  exit 1
fi
EOF

chmod +x /usr/local/bin/backup-houston.sh

# Cron-Job einrichten (täglich um 2 Uhr morgens)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-houston.sh") | crontab -

# Optional: Backup vor jedem Deployment (wird bereits im Deployment-Script gemacht)
```

**Backup-Strategie**:

- **Tägliche Backups**: Automatisch um 2 Uhr morgens
- **Pre-Deployment Backups**: Automatisch vor jedem Deployment (bereits implementiert)
- **Aufbewahrung**: 30 Tage
- **Komprimierung**: Gzip-Komprimierung für Speicherplatzersparnis
- **Backup-Verzeichnis**: `/var/backups/houston/`

**Backup-Wiederherstellung**:

```bash
# Backup auflisten
ls -lh /var/backups/houston/

# Backup wiederherstellen
BACKUP_FILE="/var/backups/houston/houston-backup-20251203_020000.tar.gz"
tar -xzf "$BACKUP_FILE" -C /var/www/ --strip-components=1
sudo chmod -R 755 /var/www/html
sudo systemctl reload nginx
```

---

## 📋 Monitoring-Checkliste

### Tägliche Checks

- [ ] Seite erreichbar? (`curl -I https://houston.manus.space`)
- [ ] Keine Fehler in Deployment-Log? (`tail -n 50 /var/log/houston-deployment.log`)
- [ ] Disk-Space ausreichend? (`df -h /var/www/html`)
- [ ] Backups erfolgreich? (`ls -lh /var/backups/houston/ | tail -5`)

### Wöchentliche Checks

- [ ] Log-Rotation funktioniert? (`ls -lh /var/log/houston-deployment.log*`)
- [ ] Backup-Verzeichnis nicht zu groß? (`du -sh /var/backups/houston/`)
- [ ] Monitoring-Logs prüfen? (`tail -n 100 /var/log/houston-monitoring.log`)
- [ ] Performance-Metriken prüfen (Plausible Analytics)

### Monatliche Checks

- [ ] Backup-Wiederherstellung testen
- [ ] Log-Archivierung prüfen
- [ ] Monitoring-Alerts testen
- [ ] Disaster-Recovery-Plan aktualisieren

---

## 🚨 Alerting

### Kritische Alerts

- **HTTP Status != 200**: Sofort benachrichtigen
- **Disk-Space > 90%**: Warnung auslösen
- **Deployment fehlgeschlagen**: Sofort benachrichtigen
- **Backup fehlgeschlagen**: Warnung auslösen

### Warnungen

- **HTTP Status 503**: Service Unavailable
- **Disk-Space > 80%**: Vorwarnung
- **Kein Deployment in 7 Tagen**: Info

---

## 📊 Metriken & KPIs

### Deployment-Metriken

- **Deployment-Frequenz**: Wie oft wird deployed?
- **Deployment-Dauer**: Durchschnittliche Deployment-Zeit
- **Deployment-Erfolgsrate**: % erfolgreicher Deployments
- **Rollback-Rate**: Wie oft muss zurückgerollt werden?

### Performance-Metriken

- **Uptime**: % Verfügbarkeit der Seite
- **Response-Zeit**: Durchschnittliche Antwortzeit
- **Error-Rate**: % fehlgeschlagener Requests

---

## 🔗 Integration mit bestehenden Systemen

### Sentry (Error Tracking)

- Bereits integriert über `@sentry/react` und `@sentry/node`
- Überwacht automatisch JavaScript- und Server-Fehler
- Alerts bei kritischen Fehlern

### Plausible Analytics

- Bereits integriert über `VITE_PLAUSIBLE_DOMAIN`
- Überwacht Traffic und Performance
- Keine persönlichen Daten

### GitHub Actions

- Deployment-Logs in GitHub Actions verfügbar
- Workflow-Status überwachen
- Automatische Benachrichtigungen bei Fehlern

---

## 📝 Nächste Schritte

1. **Monitoring-Script installieren**: `/usr/local/bin/monitor-houston.sh`
2. **Logrotate konfigurieren**: `/etc/logrotate.d/houston-deployment`
3. **Backup-Script installieren**: `/usr/local/bin/backup-houston.sh`
4. **Cron-Jobs einrichten**: Monitoring (5min), Backup (täglich)
5. **Monitoring-Dashboard erstellen**: Optional mit Grafana oder ähnlich
6. **Alerting konfigurieren**: Email/Slack-Benachrichtigungen

---

**Erstellt**: 2025-12-03  
**Zuletzt aktualisiert**: 2025-12-03  
**Status**: ✅ Empfohlen für Produktion
