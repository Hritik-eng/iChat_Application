const socket = io()
let sound = new Audio("music.mp3");
let name,markup;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

let send = document.querySelector("#send")


// do {
//     name = prompt('Please enter your name: ')
//     socket.emit("new-user",name)
// } while(!name)
let u;
let n;
socket.emit("new-user")
socket.on("user",(name)=>{
    u = name;
    alert(name+" is joinig the chat")
})


textarea.addEventListener('click', (e) => {
        n = e.target.name
})

textarea.addEventListener('touchstart', (e) => {
        n = e.target.name
})

textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        n = e.target.name
        sendMessage(e.target.value,n)
    }
})

send.addEventListener("click",()=>{
   
    if(textarea.value == ""){
       
    }
    else{
    
    sendMessage(textarea.value,n)
    }
})


// for device like mobile phones
send.addEventListener("touchend",()=>{
   
    if(textarea.value == ""){
       
    }
    else{
    
    sendMessage(textarea.value,n)
    }
})



function sendMessage(message,n) {
    sound.play();
    let msg = {
        user: n,
        message: message.trim()
    }
    // Append
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server
    socket.emit('message', msg)

}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
     mainDiv.classList.add(className, 'message')
     let username = document.querySelector('.username')
     let markup = `
     <h4 style="color:white">${msg.user}</h4>
     <p style="blue: #F06D06">${msg.message}</p>
 `
    //  if(type === "incoming"){
    //  markup = `
    //    <h4 style="color:white">${u}</h4>
    //     <p style="blue: #F06D06">${msg.message}</p>
    // `
    //  }
    //  else{
    //     markup = `
    //     <h4 style="color:white">${username.innerText}</h4>
    //      <p style="blue: #F06D06">${msg.message}</p>
    //  `
    //  }
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)

}

// Recieve messages
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')

    scrollToBottom()
})

socket.on('leave',(name)=>{
    alert(`${name} left the chat`)
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



