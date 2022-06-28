const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const typing_message = get(".typing_message");
const notification = get(".notification");

var io = io('http://localhost:3000');

  
var username='';
while (username===''){
   username =  window.prompt('Enter your username');
}

if(username!==''){
  io.emit("user_connected",username);
}

io.on("user_connected", function(username){
  console.log(username+" connected");
  notification.classList.add("active")
  notification.innerHTML = `<span>${username}: </span> has joined the chat`;
  setTimeout(() => {
    notification.classList.remove("active")
    notification.innerHTML = ''
  }, 3000);
})



io.on("user_disconnected", function(user){
  console.log(user+" disconnected")
  notification.classList.add("active")
  notification.innerHTML = `<span>${user}: </span> has left the chat`;
  setTimeout(() => {
    notification.classList.remove("active")
    notification.innerHTML = ''
  }, 3000);
})


// Icons made by Freepik from www.flaticon.com
var RECIVER_IMG = "https://png.pngtree.com/png-clipart/20190520/original/pngtree-vector-users-icon-png-image_4144740.jpg";
var SENDER_IMG = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR56Ra9LGKD03SsylrScsodXGP1p3sWAg3iuXHEzaqw0b3yScE-Uxq33L_vAnR7C7bufsM&usqp=CAU";



msgerInput.addEventListener("input", function(){
  io.emit("typing",username)
})


function debounce(func, delay) {
  setTimeout(()=>{ 
    func();
  },delay);
}

io.on("typing",function(username){
  typing_message.innerHTML = username+" is typing...";
  debounce(function(){
    typing_message.innerHTML = '';
  },2000)
})




msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  let message = {
    name:username,
    msg:msgText
  }
  io.emit("message", message);
  msgerInput.value = "";
  
  appendMessage('You', SENDER_IMG, "right",message.msg);
 
});


io.on('new_message',(data)=> {
  console.log(data)
  appendMessage(data.name, SENDER_IMG, "left",data.msg);
  
});



function appendMessage(name, img, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}


// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}
