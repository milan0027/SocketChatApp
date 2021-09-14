const socket = io()

//elements
const _messageForm = document.querySelector('#message-form')
const _messageFormInput = document.querySelector('input')
const _messageFormButton = document.querySelector('#sendButton')
const _sendLocationButton = document.querySelector('#send-location')
const _messages = document.querySelector('#messages')

//templates
const messageTemplate = document.querySelector('#msg-template').innerHTML
const locationTemplate =  document.querySelector('#loc-msg-template').innerHTML


socket.on('countUpdated', (count) =>{
    console.log('the count has been updated', count)
})

socket.on('locationMessage', (urlLocation)=>{
    console.log(urlLocation)

    const html = Mustache.render(locationTemplate, {
        urlLocation: urlLocation.url,
        createdAt: moment(urlLocation.createdAt).format('hh:mm A')
    })
    _messages.insertAdjacentHTML('beforeend', html)
})


socket.on('message', (msg)=>{
    console.log(msg)
    const html = Mustache.render(messageTemplate,{
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm A')
    })
    _messages.insertAdjacentHTML('beforeend', html)
})

document.querySelector('#increment').addEventListener('click', ()=> {
    console.log('clicked')
    socket.emit('increment')
})
_messageForm.addEventListener('submit', (e)=>{

    e.preventDefault()

    _messageFormButton.setAttribute('disabled', 'disabled')

    let data = document.querySelector('input').value 
    socket.emit('sendMessage', data, (msg)=>{
    _messageFormButton.removeAttribute('disabled')
    _messageFormInput.value = ''
    _messageFormInput.focus()

        if(msg){
            return console.log(msg)
        }
        console.log('the message has been acknowledged')
    })

})

_sendLocationButton.addEventListener('click', ()=>{
    if(!navigator.geolocation)
    {
        return alert('geolocation not supported')
    }

    _sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position)=> {
       socket.emit('sendlocation', 
       { lat: position.coords.latitude, lon: position.coords.longitude },
       ()=>{

           _sendLocationButton.removeAttribute('disabled')
           console.log('location shared')
       })
    })
})