const { ipcRenderer } = require("electron");

// Utility functions
async function fetchData(url, method, body = null) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const data = await response.json();
  return data;
}

// Register user
async function registerUser(username, password) {
  const url = "http://localhost:3000/auth/register";
  const body = { username, password };
  return await fetchData(url, "POST", body);
}

// Login user
async function loginUser(username, password) {
  const url = "http://localhost:3000/auth/login";
  const body = { username, password };
  return await fetchData(url, "POST", body);
}

// Create room
async function createRoom(name) {
  const url = "http://localhost:3000/rooms/create";
  const body = { name };
  return await fetchData(url, "POST", body);
}

// Get rooms
async function getRooms() {
  const url = "http://localhost:3000/rooms";
  return await fetchData(url, "GET");
}

// Send message
async function sendMessage(roomId, message) {
  const url = `http://localhost:3000/messages/send`;
  const body = { roomId, message };
  return await fetchData(url, "POST", body);
}

// Register form submission
document
  .getElementById("registerForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const result = await registerUser(username, password);

    if (result.message === "User registered successfully") {
      alert("Registration successful! Please log in.");
      // Switch to the login form
      document.getElementById("registerContainer").style.display = "none";
      document.getElementById("loginContainer").style.display = "block";
    } else {
      alert(result.message);
    }
  });

// Login form submission
document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    const result = await loginUser(username, password);

    if (result.token) {
      localStorage.setItem("token", result.token);
      // Switch to the chat container
      document.getElementById("loginContainer").style.display = "none";
      document.getElementById("chatContainer").style.display = "block";
      initializeChat();
    } else {
      alert(result.message);
    }
  });

// Initialize chat
async function initializeChat() {
  const rooms = await getRooms();
  const roomsList = document.getElementById("roomsList");
  roomsList.innerHTML = "";

  rooms.forEach((room) => {
    const roomElement = document.createElement("div");
    roomElement.innerText = room.name;
    roomElement.className = "room";
    roomElement.addEventListener("click", () => {
      enterRoom(room.id);
    });
    roomsList.appendChild(roomElement);
  });
}

// Create room form submission
document
  .getElementById("createRoomForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const roomName = document.getElementById("newRoomName").value;
    const result = await createRoom(roomName);

    if (result.message === "Room created successfully") {
      alert("Room created!");
      initializeChat();
    } else {
      alert(result.message);
    }
  });

// Enter room
function enterRoom(roomId) {
  document.getElementById("roomId").value = roomId;
  // Fetch messages for the room and display them
  fetchMessages(roomId);
}

// Fetch messages for a room
async function fetchMessages(roomId) {
  const url = `http://localhost:3000/messages?roomId=${roomId}`;
  const messages = await fetchData(url, "GET");
  const messagesContainer = document.getElementById("messages");
  messagesContainer.innerHTML = "";

  messages.forEach((msg) => {
    const msgElement = document.createElement("div");
    msgElement.innerText = `${msg.username}: ${msg.message}`;
    messagesContainer.appendChild(msgElement);
  });
}

// Send message form submission
document
  .getElementById("sendMessageForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const roomId = document.getElementById("roomId").value;
    const message = document.getElementById("message").value;

    const result = await sendMessage(roomId, message);

    if (result.message === "Message sent successfully") {
      alert("Message sent!");
      fetchMessages(roomId);
    } else {
      alert(result.message);
    }
  });
