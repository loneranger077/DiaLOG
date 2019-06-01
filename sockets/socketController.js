module.exports = function (sockets){

    this.send = (type, body, group, context) => {
        for (client of sockets.groups[group]) {
            client.socket.send(JSON.stringify({ type: type, body: body, context: context || group }))
        }
    }

    this.sendToUser = (type, body, user, context) => {
        for (client of sockets.clients) {
            if (client.uid === user) {
                client.socket.send(JSON.stringify({ type: type, body: body, context: context || user }))
            }
        }
    }
}