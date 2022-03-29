const socket = io()

//Elements (convention to select DOM elements $)
const $messageForm = document.querySelector("#inputForm")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML


// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin //doesn't consider margin

    //Visible Height
    const visibleHeight = $messages.offsetHeight 

    //Height of messages container
    const containerHeight = $messages.scrollHeight 

    //Upto what we have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight //Gives amount of distance we have scrolled from the top of page + visibleHeight in total giving us where the current msg is

    //As no scrollBottom is there hence we have to do this (to only move to the bottom always this line will do)
    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

 
socket.on("message", (message) => {
    // console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})

socket.on("locationMessage", (message) => {
    // console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoscroll()
})


socket.on("roomData", ({ users, room }) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate, {
        users,
        room
    })
    document.querySelector("#sidebar").innerHTML = html
})


$messageForm.addEventListener("submit",(e) => {
    e.preventDefault()
    //diable the form (2nd argument can be any name)
    $messageFormButton.setAttribute("disabled", "disabled")
    

    const inputMsg = e.target.elements.message.value
    
    socket.emit("sendMessage", inputMsg, (error) => {
        //enable the form
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if(error) {
            return  console.log(error)
        }

        console.log("Message delivered!")
    })
})

$sendLocationButton.addEventListener("click", () => {
    if(!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.")
    }

    $sendLocationButton.setAttribute("disabled", "disabled")

    //This doesn't support promises so we have to use callback
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
                console.log("Location shared")
                $sendLocationButton.removeAttribute("disabled")            
        })
    })
})


socket.emit("join", { username, room }, (error) => {
    if(error) {
        alert(error)
        //redirecting the user to the join page
        location.href = "/"
    }
})

// socket.on("countUpdated", (count) => {
//     console.log("Count is updated "+count)
// })

// document.querySelector("#inc").addEventListener("click", () => {
//     console.log("Clicked")
//     socket.emit("increment")
// })