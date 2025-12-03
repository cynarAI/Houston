# Houston App - Deployment & Server Configuration

Dieses Verzeichnis enthält alle notwendigen Konfigurationsdateien und Anleitungen für die Bereitstellung der Houston App auf einem Produktionsserver.

## Dateien

- **SETUP.md** - Schritt-für-Schritt Anleitung für die Server-Einrichtung
- **nginx.conf** - Nginx-Konfiguration als Reverse Proxy
- **houston.service** - Systemd-Service-Definition
- **.env.example** - Template für Umgebungsvariablen

## Quick Start

1. Kopiere die Dateien auf deinen Server
2. Folge den Anweisungen in [SETUP.md](./SETUP.md)
3. Passe die `.env`-Datei an deine Umgebung an
4. Starte die Dienste

## Wichtige Hinweise

- **Secrets:** Die `.env`-Datei enthält sensible Daten. Speichere sie **nicht** im Repository. Verwende `.env.example` als Template.
- **SSL/TLS:** Verwende Let's Encrypt für Produktionsumgebungen.
- **Backups:** Das Deployment-Skript erstellt automatisch Backups.
- **Monitoring:** Ein Monitoring-Skript läuft alle 15 Minuten.

## Support

Bei Fragen oder Problemen konsultiere die Dokumentation oder öffne ein Issue im Repository.
