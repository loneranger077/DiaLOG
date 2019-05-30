$(document).ready(function(){

    const groupsContainer = $("#groups > ul")
    const channelsContainer = $("#channels > ul")
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
                resolve(response.messages);
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
                resolve(response.channels);
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

    const renderGroups = (groups) => {
        for (group of groups) {
            groupsContainer.append(buildButton(group.channelsAPIPath, group.name, "channels"))
        }
    }

    const renderChannels = (channels) => {
        channelsContainer.find("li:not(.static)").remove()
        messagesContainer.find(".list-group-item").remove()
        for (channel of channels) {
            channelsContainer.append(buildButton(channel.messagesAPIPath, channel.name, "messages"))
        }
    }

    const renderMessages = (messages) => {
        messagesContainer.find(".list-group-item").remove()
        for (message of messages) {
            messagesContainer.prepend(buildMessage(message.body))
        }
    }

    getGroups().then(groups => { renderGroups(groups) })

    $(document).on("click", ".action-button", function(e){
        e.preventDefault()
        const button = $(this)
        const action = button.attr("data-action")
        const link = button.attr("href")
        switch (action) {
            case "channels":
                groupsContainer.find(".action-button").removeClass("active")
                getChannels(link).then(channels => { renderChannels(channels) })
                break;
            case "messages":
                channelsContainer.find(".action-button").removeClass("active")
                getMessages(link).then(messages => { renderMessages(messages) })
                break;
        }
        button.addClass("active")
    })
})