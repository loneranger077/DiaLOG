module.exports = function (app) {
    this.clients = []

    app.ws('/ws', (ws, req) => {
        this.clients.push({ socket: ws, uid: req.session.userID })

        ws.on('message', msg => {
            for (client of this.clients) {
                client.socket.send(msg)
            }
        })

        ws.on('close', () => {
            console.log('WebSocket was closed')
            for (i in this.clients) {
                const client = this.clients[i]
                if (client.socket.readyState >= 2) {
                    this.clients.splice(i, 1); 
                }
            }
        })
    })

    this.groups = {}

    app.ws('/ws/groups/:group', (ws, req) => {
        if (!this.groups[req.params.group]) this.groups[req.params.group] = []
        this.groups[req.params.group].push({ socket: ws, uid: req.session.userID })

        ws.on('message', msg => {
            console.log(msg);
            for (client of this.groups[req.params.group]) {
                client.socket.send(msg)
            }
        })

        ws.on('close', () => {
            console.log('WebSocket was closed')
            for (i in this.groups[req.params.group]) {
                const client = this.groups[req.params.group][i]
                if (client.socket.readyState >= 2) {
                    this.groups[req.params.group].splice(i, 1);
                }
            }
        })
    })

};