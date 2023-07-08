const socket = io();
const chatbox = document.getElementById("chatbox");
let user = sessionStorage.getItem("user") || "";

if (!user) {
  Swal.fire({
    title: "Registro",
    input: "text",
    text: "Ingresá tu UserName",
    inputValidator: (value) => {
      return !value.trim() && "Please. write a username";
    },
    allowOutsideClick: false,
  }).then((result) => {
    user = result.value;
    document.getElementById("username").innerHTML =
      "🔮 Bienvenid@ " + user.toLocaleUpperCase() + "!.  Ya puedes chatear! :";
    sessionStorage.setItem("user", user);
    socket.emit("new", user);
  });
} else {
  document.getElementById("username").innerHTML =
    "🔮 Bienvenid@ " + user.toLocaleUpperCase() + "!.  Ya puedes chatear! :";
  socket.emit("new", user);
}

//enviar mensaje
chatbox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const message = chatbox.value.trim();
    if (message.length > 0) {
      socket.emit("message", {
        user,
        message,
      });

      chatbox.value = "";
    }
  }
});

// Recibir Mensajes
socket.on("logs", (data) => {
  const divLogs = document.getElementById("logs");
  console.log(data);
  let messages = "";

  data.forEach((msn) => {
    messages =
      `<p><i class="nickname">👤 ${msn.user}:</i> ${msn.message}</p>` +
      messages;
  });

  divLogs.innerHTML = messages;
});
