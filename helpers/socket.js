module.exports = {
    send: (type, body, context, group, sockets) => {
        for (client of sockets.groups[group]) {
            client.socket.send(JSON.stringify({ type: type, body: body, context: context}))
        }
    }
};