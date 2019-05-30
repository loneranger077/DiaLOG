$(document).ready(function(){

    const groupsContainer = $("#groups > ul")
    const channelsContainer = $("#channels")
    const messagesContainer = $("#view > .messages > .list-group")

    const buildButton = (link, text, action) => {
        const buttonContainer = $("<li>").addClass("nav-item")
        buttonContainer.append($("<a>").addClass("nav-link action-button").attr("href", link).attr("data-action", action).text(text))
        return buttonContainer
    }

    const buildMessage = (message) => {
        const messageContainer = $("<li>").addClass("list-group-item").text(message)
        return messageContainer
    }

    const getMessages = (link) => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: link,
                method: "GET"
            }).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        })
    }

    const getChannels = (link) => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: link,
                method: "GET"
            }).then(function (response) {
                resolve(response);
            }).catch(function (error) {
                reject(error);
            });
        })
    }

    const getGroups = () => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/api/groups",
                method: "GET"
            }).then(function (response) {
                resolve(response.groups);
            }).catch(function (error) {
                reject(error);
            });
        })
    }

    const createGroup = () => {

    }

    const createChannel = () => {

    }

    const addMember = (link) => {

    }

    const sendMessage = (link) => {

    }

    const changeGroup = (link) => {

    }

    getGroups().then(groups => {
        for (group of groups){
            groupsContainer.append(buildButton(group.channelsAPIPath, group.name, "channels"))
        }
    })
})