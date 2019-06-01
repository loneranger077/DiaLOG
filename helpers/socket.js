module.exports = {
    send: (type, body, context, group, sockets) => {
        for (client of sockets.groups[group]) {
            client.socket.send(JSON.stringify({ type: type, body: body, context: context }))
        }
    },
    sendToUser: (type, body, context, user, sockets) => {
        for (client of sockets.clients) {
            if (client.uid === user) {
                client.socket.send(JSON.stringify({ type: type, body: body, context: context }))
            }
        }
    }
};