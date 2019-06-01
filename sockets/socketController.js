module.exports = function (sockets){
    
    this.send = (type, body, context, group) => {
        for (client of sockets.groups[group]) {
            client.socket.send(JSON.stringify({ type: type, body: body, context: context }))
        }
    }

    this.sendToUser = (type, body, context, user) => {
        for (client of sockets.clients) {
            if (client.uid === user) {
                client.socket.send(JSON.stringify({ type: type, body: body, context: context }))
            }
        }
    }
}