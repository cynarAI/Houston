## High-Speed Workflow mit Cursor & MCP

### 1. Feature / Änderung beauftragen (für Chat oder Composer)

**Prompt-Template – Feature bauen**

```text
Ziel: [kurze Beschreibung des Features]

Kontext:
- Relevante Teile des Systems: [Ordner/Module]
- Wichtige Constraints: [Performance, Security, DX, etc.]

Bitte:
1. Erstelle erst einen kurzen Plan in Stichpunkten.
2. Führe dann alle nötigen Änderungen selbstständig aus (Code, Tests, evtl. Config).
3. Zeige mir am Ende eine knappe Zusammenfassung (max. 5 Bullet Points).
4. Nutze vorhandene Tools (Shell, Browser, HTTP, etc.), wenn sinnvoll.
```

**Prompt-Template – Bugfix**

```text
Ziel: Bugfix

Problem:
- Beobachtetes Verhalten:
- Erwartetes Verhalten:
- Reproduktion (Schritte / Request / Screenshot):

Bitte:
1. Finde die wahrscheinlichste Ursache im Code.
2. Schlage 1–2 Lösungsansätze vor.
3. Implementiere die gewählte Lösung inkl. Tests.
4. Erkläre mir kurz, was genau geändert wurde und warum.
```

### 2. Git & Tests vom Agenten machen lassen

**Prompt-Template – Tests & Commit-Vorbereitung**

```text
Bitte:
1. Führe die in diesem Projekt üblichen Tests aus (Unit/Integration/e2e, falls definiert).
2. Falls Tests fehlschlagen: analysiere die wichtigsten Fehler und schlage einen Fix vor.
3. Erstelle danach eine sinnvolle Commit-Message, die das "Warum" beschreibt.
4. Zeige mir `git diff` in zusammengefasster Form (keine kompletten Files, nur Kernausschnitte).
```

### 3. Browser-/Server-Automation

**Prompt-Template – Browser Automation (Playwright/Puppeteer)**

```text
Ziel: Browser-Task

Aufgabe:
- Öffne URL: [URL]
- Erledige: [Login, Navigation, Form ausfüllen, Screenshot, etc.]

Bitte:
1. Nutze bevorzugt Playwright oder Puppeteer als MCP-Tool.
2. Arbeite in möglichst wenigen Schritten (so viel wie möglich pro Aufruf erledigen).
3. Dokumentiere kurz, welche Aktionen du durchgeführt hast.
```

**Prompt-Template – Shell Automation (mac-shell)**

```text
Ziel: Shell-Task

Aufgabe / Kontext:
- Projektordner / Server: [Pfad / Beschreibung]
- Was soll erledigt werden: [z.B. Logs anzeigen, Build ausführen, Script starten]

Bitte:
1. Nutze das `mac-shell` MCP-Tool für Befehle.
2. Erkläre bei kritischen Befehlen kurz, was sie tun, bevor du sie ausführst.
3. Zeige mir relevante Auszüge aus der Ausgabe, nicht den kompletten Log.
```

### Nutzung in Cursor

- Diese Prompts kannst du kopieren und als **Snippets** oder eigene Composer-"Presets" in Cursor hinterlegen.
- Im Chat einfach ein Template einfügen, ausfüllen und das Modell im **Auto-Modus** laufen lassen, damit MCP-Tools automatisch genutzt werden.
