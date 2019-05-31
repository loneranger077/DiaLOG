const path = require("path");
const sessionHelper = require("../../helpers/session.js");

module.exports = function (app, wss) {
    const clients = []

    app.ws('/ws', (ws, req) => {
        clients.push({ socket: ws, uid: req.session.userID })

        ws.on('message', msg => {
            for (client of clients) {
                client.socket.send(msg)
            }
        })

        ws.on('close', () => {
            console.log('WebSocket was closed')
            for (i in clients) {
                const client = clients[i]
                if (client.socket.readyState >= 2) {
                    clients.splice(i, 1); 
                }
            }
        })
    })

};