const MONGO_CONNECTION_STRING = "mongodb+srv://username:password@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority";

async function connectToMongoAtlas() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const connection = {
                connectionId: generateToken(8),
                connectionString: MONGO_CONNECTION_STRING,
                status: "connected"
            };
            console.log("Connected to Mongo Atlas with connection string:", connection.connectionString);
            console.log("Connection details:", connection);
            resolve(connection);
        }, 1000); 
    });
}
function getUsers() {
    const usersJson = localStorage.getItem('users');
    return usersJson ? JSON.parse(usersJson) : [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function setCurrentToken(token) {
    localStorage.setItem('currentToken', token);
}

function getCurrentToken() {
    return localStorage.getItem('currentToken');
}

function removeCurrentToken() {
    localStorage.removeItem('currentToken');
}

async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function generateToken(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function updateAuthButton() {
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        if (getCurrentToken()) {
            authButton.innerHTML = 'تسجيل خروج';
            authButton.href = '#';
            authButton.addEventListener('click', function(e) {
                e.preventDefault();
                removeCurrentToken();
                alert('تم تسجيل الخروج!');
                window.location.href = 'index.html';
            });
        } else {
            authButton.innerHTML = 'تسجيل دخول';
            authButton.href = 'login.html';
        }
    }
}

async function sendDataToMongoAtlas(connection, data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Data sent to Mongo Atlas via connection:", connection.connectionId);
            console.log("Connection String Used:", connection.connectionString);
            console.log("Data:", data);
            resolve({ status: "data sent", connectionId: connection.connectionId });
        }, 1000);
    });
}

// (async () => {
//     const dbConnection = await connectToMongoAtlas();
//     const result = await sendDataToMongoAtlas(dbConnection, { sample: "data" });
//     console.log(result);
// })();
