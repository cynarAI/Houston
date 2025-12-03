# Vercel Domain Setup - houston.manus.space

**Datum:** 2025-12-03  
**Domain:** `houston.manus.space`

---

## 🎯 Ziel

Vercel Deployment soll unter der Domain `houston.manus.space` erreichbar sein.

---

## 📋 Setup-Schritte

### 1. Domain in Vercel hinzufügen

**Im Vercel Dashboard:**

1. Gehe zu **Project Settings → Domains**
2. Klicke auf **Add Domain**
3. Gib ein: `houston.manus.space`
4. Wähle **Production** (oder Preview)
5. Klicke auf **Add**

### 2. DNS-Records erhalten

**Vercel zeigt nach dem Hinzufügen DNS-Records an:**

**Option A: CNAME (Empfohlen)**

```
Type: CNAME
Name: houston
Value: cname.vercel-dns.com
TTL: 3600
```

**Option B: A-Record**

```
Type: A
Name: houston
Value: 76.76.21.21 (oder andere Vercel IP)
TTL: 3600
```

### 3. DNS-Records bei Manus konfigurieren

**WICHTIG:** DNS muss bei Manus (Domain-Inhaber) konfiguriert werden!

**Optionen:**

1. **Manus Dashboard:**
   - Gehe zu Domain-Settings
   - Füge DNS-Record hinzu (CNAME oder A-Record)
   - Warte auf DNS-Propagierung (5-60 Minuten)

2. **Manus Support kontaktieren:**
   - Bitte um DNS-Record-Konfiguration für `houston.manus.space`
   - Sende die Vercel DNS-Records mit

3. **Eigener DNS-Provider:**
   - Falls Manus DNS extern verwaltet wird
   - Konfiguriere dort die DNS-Records

---

## ✅ Verifikation

### DNS-Check

```bash
# Prüfe DNS-Auflösung
dig houston.manus.space
# oder
nslookup houston.manus.space
```

**Erwartetes Ergebnis:**

- CNAME zeigt auf `cname.vercel-dns.com`
- Oder A-Record zeigt auf Vercel IP

### SSL-Zertifikat

**Vercel stellt automatisch SSL-Zertifikat bereit:**

- HTTPS wird automatisch aktiviert
- Zertifikat wird automatisch erneuert

**Prüfung:**

```bash
curl -I https://houston.manus.space
```

**Erwartetes Ergebnis:**

- HTTP 200 oder 301/302 Redirect
- SSL-Zertifikat ist gültig

---

## 🔧 Vercel-Konfiguration

**Datei:** `vercel.json`

```json
{
  "domains": ["houston.manus.space"]
}
```

**Hinweis:** Die Domain-Konfiguration in `vercel.json` ist optional. Wichtiger ist die Konfiguration im Vercel Dashboard.

---

## ⚠️ Wichtige Hinweise

### DNS-Propagierung

- DNS-Änderungen können 5-60 Minuten dauern
- Manchmal auch bis zu 48 Stunden (selten)
- Verwende `dig` oder `nslookup` zum Prüfen

### SSL-Zertifikat

- Vercel stellt automatisch SSL bereit
- Zertifikat wird nach DNS-Verifikation ausgestellt
- Kann 5-10 Minuten dauern

### Domain-Verifikation

- Vercel verifiziert Domain-Besitz über DNS
- DNS-Record muss korrekt konfiguriert sein
- Verifikation kann einige Minuten dauern

---

## 📊 Status-Checkliste

- [ ] Domain in Vercel Dashboard hinzugefügt
- [ ] DNS-Records von Vercel erhalten
- [ ] DNS-Records bei Manus konfiguriert
- [ ] DNS-Propagierung abgewartet (5-60 Min)
- [ ] DNS-Auflösung geprüft (`dig houston.manus.space`)
- [ ] SSL-Zertifikat aktiv (automatisch von Vercel)
- [ ] Domain erreichbar (`curl https://houston.manus.space`)

---

## 🆘 Troubleshooting

### Domain nicht erreichbar

1. **DNS prüfen:**

   ```bash
   dig houston.manus.space
   ```

2. **Vercel Dashboard prüfen:**
   - Gehe zu Project Settings → Domains
   - Prüfe ob Domain verifiziert ist
   - Prüfe ob DNS-Records korrekt sind

3. **DNS-Propagierung abwarten:**
   - Kann bis zu 48 Stunden dauern (selten)
   - Normalerweise 5-60 Minuten

### SSL-Zertifikat fehlt

- Warte 5-10 Minuten nach DNS-Verifikation
- Vercel stellt automatisch SSL bereit
- Prüfe Vercel Dashboard → Domains → SSL Status

### Domain zeigt auf alte Seite

- DNS-Cache leeren
- Browser-Cache leeren
- Warte auf DNS-Propagierung

---

## 📝 Zusammenfassung

1. ✅ Domain `houston.manus.space` in Vercel hinzufügen
2. ✅ DNS-Records von Vercel erhalten
3. ✅ DNS-Records bei Manus konfigurieren
4. ✅ DNS-Propagierung abwarten
5. ✅ Domain-Verfügbarkeit prüfen

**Nach erfolgreicher Konfiguration:**

- `houston.manus.space` zeigt auf Vercel-Deployment
- HTTPS ist automatisch aktiviert
- Automatisches Deployment bei jedem Push zu `main`

---

**Erstellt:** 2025-12-03  
**Status:** ⚠️ DNS-Konfiguration bei Manus erforderlich
