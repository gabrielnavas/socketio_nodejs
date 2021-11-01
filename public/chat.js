const socket = io(/**http://localhost:3000... */)

const urlSearch = new URLSearchParams(window.location.search)
const username = urlSearch.get('username')
const room = urlSearch.get('select_room')

// emit => emitr alguma dado
// on => escutar algum dado


const createMessage = (data) => {
    return `
        <div id="new_message">
            <label id="form-label">
                <strong> ${data.username}</strong>
                <span>${data.text}</span>
                <div class="date">${dayjs(data.createdAt).format("DD/MM HH:mm")}</div>
            </label>
        </div>
    `
}

const receiveAllMessagesCallback = messages => {
    const messageDiv = document.getElementById("messages")
    let messageHtml = ''
    messages.forEach(message => {
        messageHtml += createMessage(message)
    })
    messageDiv.innerHTML = messageHtml + messageDiv.innerHTML 
}

// get from input chat.html 
document.getElementById("message_field").addEventListener("keypress", e => {
    if (e.key === 'Enter') {
        const message = e.target.value
        const payload = {
            room, message, username
        }
        socket.emit("message", payload)
            
        e.target.value = ''
    }
})

document.getElementById("logout").addEventListener("click", e => {
    const payload = {
        room, username
    }
    socket.emit("close", payload)
    window.location.href = 'index.html'
})


socket.emit('select_room', {
    username,
    room
}, receiveAllMessagesCallback )

const usernameDiv = document.getElementById("username")
usernameDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`


socket.on("message", data => {
    const messageDiv = document.getElementById("messages")
    const messageHtml = createMessage(data)
    messageDiv.innerHTML = messageHtml + messageDiv.innerHTML 
})

