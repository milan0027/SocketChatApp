const socket = io()



socket.on('countUpdated', (count) =>{
    console.log('the count has been updated', count)
})

socket.on('message', (msg)=>{
    console.log(msg)
})

document.querySelector('#increment').addEventListener('click', ()=> {
    console.log('clicked')
    socket.emit('increment')
})

document.querySelector('#message').addEventListener('submit', (e)=>{

    e.preventDefault()

    let data = document.querySelector('input').value 
    socket.emit('sendMessage', data)

})