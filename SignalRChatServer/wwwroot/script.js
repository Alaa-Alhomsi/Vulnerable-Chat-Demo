let username = '';
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

// Diese Funktion muss VOR dem connection.start() definiert werden
function setUsername() {
    const usernameInput = document.getElementById("usernameInput");
    if (usernameInput.value.trim() === "") {
        alert("Bitte gib einen Namen ein!");
        return;
    }
    
    username = usernameInput.value.trim();
    document.getElementById("usernameModal").classList.remove("active");
    
    // Setze den aktuellen Benutzernamen in der Header-Anzeige
    document.getElementById("currentUsername").textContent = username;
    // Starte die Verbindung und lade die Nachrichten
    connection.start()
        .then(() => {
            console.log("Verbunden als: " + username);
            loadMessages();
        })
        .catch(err => console.error(err));
}

// Funktion zur Generierung einer Farbe basierend auf dem Benutzernamen
function generateColorFromUsername(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 85%)`; // Helle Pastellfarben für bessere Lesbarkeit
}

// Funktion zum Formatieren des Datums
function formatDateTime(utcDateString) {
    try {
        const date = new Date(utcDateString);
        
        // Überprüfen ob das Datum gültig ist
        if (isNaN(date.getTime())) {
            console.log("Ungültiges Datum erhalten:", utcDateString);
            return "";
        }
        
        return date.toLocaleTimeString('de-AT', { 
            hour: '2-digit', 
            minute: '2-digit',
            //second: '2-digit'
        });
    } catch (error) {
        console.error("Fehler beim Parsen des Datums:", error);
        return "";
    }
}

// Nachrichten vom Server abrufen
function loadMessages() {
    fetch("/messages")
        .then(response => response.json())
        .then(messages => {
            messages.forEach(message => {
                const li = document.createElement("li");
                const timeStr = formatDateTime(message.sentAt);

                // Erstelle separate Spans für besseres Styling
                const messageContent = document.createElement("div");
                messageContent.className = "message-content";
                messageContent.innerHTML = message.text;

                const messageHeader = document.createElement("div");
                messageHeader.className = "message-header";
                messageHeader.textContent = `${message.sender} • ${timeStr}`;

                li.appendChild(messageHeader);
                li.appendChild(messageContent);

                // Setze Hintergrundfarbe basierend auf Benutzername
                li.style.backgroundColor = generateColorFromUsername(message.sender);

                // Ausrichtung der Nachricht
                if (message.sender === username) {
                    li.style.marginLeft = "20%";
                    li.style.marginRight = "0";
                } else {
                    li.style.marginRight = "20%";
                    li.style.marginLeft = "0";
                }

                document.getElementById("messagesList").appendChild(li);
            });

            // Automatisches Scrollen
            const messagesList = document.getElementById("messagesList");
            messagesList.scrollTop = messagesList.scrollHeight;
        })
        .catch(err => console.error('Fehler beim Laden der Nachrichten:', err));
}

// Nachrichten löschen
function clearMessages() {
    fetch("/messages", {
        method: "DELETE"
    })
    .then(() => {
        document.getElementById("messagesList").innerHTML = ''; // Lösche die Liste im Frontend
    })
    .catch(err => console.error('Fehler beim Löschen der Nachrichten:', err));
}

// Funktion zum Senden der Nachrichtf

function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message.trim() === "") {
        alert("Bitte gib eine Nachricht ein!");
        return;
    }

    connection.invoke("SendMessage", username, message).catch(err => console.error(err));
    document.getElementById("messageInput").value = "";
}

// Empfange Nachrichten vom SignalR Hub
connection.on("ReceiveMessage", (user, message, timestamp) => {
    const li = document.createElement("li");
    const timeStr = formatDateTime(timestamp);

    // Erstelle separate Spans für besseres Styling
    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerHTML = message;

    const messageHeader = document.createElement("div");
    messageHeader.className = "message-header";
    messageHeader.textContent = `${user} • ${timeStr}`;

    li.appendChild(messageHeader);
    li.appendChild(messageContent);

    // Setze Hintergrundfarbe basierend auf Benutzername
    li.style.backgroundColor = generateColorFromUsername(user);

    // Ausrichtung der Nachricht
    if (user === username) {
        li.style.marginLeft = "20%";
        li.style.marginRight = "0";
    } else {
        li.style.marginRight = "20%";
        li.style.marginLeft = "0";
    }

    document.getElementById("messagesList").appendChild(li);

    // Automatisches Scrollen
    const messagesList = document.getElementById("messagesList");
    messagesList.scrollTop = messagesList.scrollHeight;
});

// Event-Listener für Enter-Tasten
document.getElementById("messageInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendMessage();
    }
});

document.getElementById("usernameInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        setUsername();
    }
});
