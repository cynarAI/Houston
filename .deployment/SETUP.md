# Houston App - Server Setup Anleitung

Diese Anleitung beschreibt, wie du die Houston App auf einem neuen Server einrichtest.

## Voraussetzungen

- Ubuntu 22.04 LTS
- Sudo-Zugriff
- Git installiert
- Eine Domain (z.B. houston.manus.space)

## Schritt 1: Repository klonen

```bash
cd /tmp
git clone https://github.com/cynarAI/Houston.git houston-deploy
cd houston-deploy
git checkout main  # oder ein spezifischer Commit
```

## Schritt 2: Basis-Pakete installieren

```bash
sudo apt-get update
sudo apt-get install -y curl wget git build-essential nginx mysql-server certbot python3-certbot-nginx nodejs npm cron logrotate
npm install -g pnpm
```

## Schritt 3: Verzeichnisstruktur erstellen

```bash
sudo mkdir -p /var/www/houston.manus.space/{dist,logs,backups}
sudo mkdir -p /opt/houston/{app,scripts,config}
sudo chown -R ubuntu:ubuntu /var/www/houston.manus.space /opt/houston
```

## Schritt 4: Konfigurationsdateien kopieren

```bash
# Kopiere Nginx-Konfiguration
sudo cp .deployment/nginx.conf /etc/nginx/sites-available/houston.manus.space
sudo ln -sf /etc/nginx/sites-available/houston.manus.space /etc/nginx/sites-enabled/houston.manus.space
sudo rm -f /etc/nginx/sites-enabled/default

# Kopiere Systemd-Service
sudo cp .deployment/houston.service /etc/systemd/system/houston.service

# Erstelle .env aus Template
cp .deployment/.env.example /opt/houston/config/.env
# WICHTIG: Bearbeite /opt/houston/config/.env und aktualisiere alle Werte!
```

## Schritt 5: MySQL-Datenbank einrichten

```bash
sudo systemctl start mysql
sudo systemctl enable mysql

# Erstelle Datenbank und Benutzer
sudo mysql -e "CREATE DATABASE IF NOT EXISTS houston_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'houston_user'@'localhost' IDENTIFIED BY 'your_secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON houston_db.* TO 'houston_user'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

## Schritt 6: Build erstellen

```bash
cd /opt/houston/app
pnpm install --frozen-lockfile
NODE_ENV=production pnpm build
```

## Schritt 7: Nginx konfigurieren und starten

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

## Schritt 8: SSL/TLS einrichten

### Option A: Let's Encrypt (Produktiv)

```bash
# Nur wenn die Domain bereits auf diesen Server zeigt
sudo certbot --nginx -d houston.manus.space --non-interactive --agree-tos -m admin@houston.manus.space
```

### Option B: Self-Signed (Tests)

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/houston.key \
  -out /etc/nginx/ssl/houston.crt \
  -subj "/C=US/ST=Texas/L=Houston/O=Houston AI/CN=houston.manus.space"
```

## Schritt 9: Systemd-Service aktivieren

```bash
sudo systemctl daemon-reload
sudo systemctl enable houston
sudo systemctl start houston
sudo systemctl status houston
```

## Schritt 10: Cronjobs einrichten

```bash
crontab -e
# Füge folgende Zeilen hinzu:
*/15 * * * * /opt/houston/scripts/monitor.sh >> /var/www/houston.manus.space/logs/cron-monitor.log 2>&1
0 2 * * * /opt/houston/scripts/deploy.sh main >> /var/www/houston.manus.space/logs/cron-deploy.log 2>&1
0 3 * * * logrotate /etc/logrotate.d/houston >> /var/www/houston.manus.space/logs/cron-logrotate.log 2>&1
```

## Schritt 11: Verifizierung

```bash
# Prüfe Nginx
sudo systemctl status nginx

# Prüfe MySQL
sudo systemctl status mysql

# Prüfe Houston Service
sudo systemctl status houston

# Teste Frontend
curl -k https://localhost/
```

## Troubleshooting

### Houston Service startet nicht

Prüfe die Logs:

```bash
sudo journalctl -u houston -n 50
```

### Nginx zeigt 502 Bad Gateway

Das Backend läuft nicht. Prüfe:

```bash
sudo systemctl status houston
curl http://localhost:3000/health
```

### SSL-Zertifikat-Fehler

Stelle sicher, dass die Domain auf diesen Server zeigt:

```bash
nslookup houston.manus.space
```

## Weitere Ressourcen

- Nginx Dokumentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/
- Node.js Best Practices: https://nodejs.org/en/docs/guides/
