$(document).ready(function () {

    const groupsContainer = $("#groups > ul")
    const channelsDrawer = $("#channels").hide()
    const channelsContainer = $("#channels > ul")
    const messagesContainer = $("#view > .messages > .list-group")
    const messageForm = $("#message-form")
    const createChannelButton = $("#create-channel-button")
    const addMemberButton = $("#add-member-button")
    const logoutForm = $("#logout-form")


    $(document).on("submit", "form.ajaxForm", function (e) {
        e.preventDefault();
        const form = $(this);
        const formObject = {};
        for (input of form.serializeArray()) {
            formObject[input.name] = input.value;
        }
        $.ajax({
            url: form.attr("action") || "./",
            method: form.attr("method") || "POST",
            data: formObject
        }).then(function (response) {
            console.log(response);
            form[0].reset();
            form.trigger("success", [response])
        }).catch(function (error) {
            console.log(error);
        });
    });

    function SocketConnection(path) {
        this.socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        this.socketUrl = `${this.socketProtocol}//${window.location.hostname}:${location.port}${path}`
        this.socket = new WebSocket(this.socketUrl);
    }

    const buildButton = (link, text, action, id) => {
        const buttonContainer = $("<li>").addClass("nav-item")
        buttonContainer.append($("<a>")
            .addClass("nav-link action-button")
            .attr("href", link)
            .attr("data-context", id)
            .attr("data-action", action).text(text))
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
        return new Promise(function (resolve, reject) {
            const modal = $("#createGroupModal")
            modal.modal('show')

            modal.find("form").on("success", function (e, result) {
                modal.modal('hide')
                resolve(result.group)
            })
        })
    }

    const createChannel = (link) => {
        return new Promise(function (resolve, reject) {
            const modal = $("#createChannelModal")
            modal.modal('show')

            modal.find("form").attr("action", link).on("success", function (e, result) {
                modal.modal('hide')
                resolve(result.channel)
            })
        })
    }

    const addMember = (link) => {
        return new Promise(function (resolve, reject) {
            const modal = $("#addMemberModal")
            modal.modal('show')

            modal.find("form").attr("action", link).on("success", function (e, result) {
                modal.modal('hide')
                resolve(result.member)
            })
        })
    }

    const login = () => {
        return new Promise(function (resolve, reject) {
            const modal = $("#loginModal")
            modal.modal('show')
            const form = modal.find("form")
            const modalTitle = modal.find(".modal-title")

            $(modal).on("click", ".toggleLoginForm", function (e) {
                let state = "login"
                let action = "/api/login"
                let title = "Login"
                let toggleButton = "Create Account"
                $(".passwordConfirm").addClass("d-none")
                if (form.attr("data-state") === "login") {
                    state = "create"
                    action = "/api/users"
                    title = "Create Account"
                    toggleButton = "Existing User"
                    $(".passwordConfirm").removeClass("d-none")
                }
                form.attr("data-state", state)
                form.attr("action", action)
                modalTitle.text(title)
                form.find(".toggleLoginForm").text(toggleButton)
            })

            form.on("success", function (e, result) {
                modal.modal('hide')
                resolve(result)
            })
        })
    }

    const logout = () => {
        return new Promise(function (resolve, reject) {
            logoutForm.submit()
            console.log(1);
            logoutForm.on("success", function (e, result) {
                resolve(result)
            })
        })
    }

    const checkSession = () => {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: "/api/session",
                method: "GET"
            }).then(function (response) {
                resolve(response.active);
            }).catch(function (error) {
                reject(error);
            });
        })
    }

    const sendMessage = (link) => {

    }

    const renderGroups = (groups) => {
        groupsContainer.find("li:not(.static)").remove()
        for (group of groups) {
            groupsContainer.append(buildButton(group.channelsAPIPath, group.name, "channels", group.id))
        }
    }

    const renderChannels = (channels) => {
        channelsContainer.find("li:not(.static)").remove()
        messagesContainer.find(".list-group-item").remove()
        for (channel of channels) {
            channelsContainer.append(buildButton(channel.messagesAPIPath, channel.name, "messages", channel.id))
        }
    }

    const renderMessages = (messages) => {
        messagesContainer.find(".list-group-item").remove()
        for (message of messages) {
            messagesContainer.prepend(buildMessage(message.body))
        }
    }

    const groupsLink = (channel) => { return `/api/groups` }
    const groupsWSLink = (group) => { return `/ws/groups/${group}` }
    const WSLink = () => { return `/ws` }
    const membersLink = (group) => { return `/api/members/${group}` }
    const channelsLink = (group) => { return `/api/channels/${group}` }
    const messagesLink = (channel) => { return `/api/messages/${channel}` }

    const listeners = () => {

        const genConnection = new SocketConnection(WSLink())

        genConnection.socket.onmessage = (e) => {
            const msg = JSON.parse(e.data)
            switch (msg.type) {
                case "member":
                    groupsContainer.append(buildButton(msg.body.channelsAPIPath, msg.body.name, "channels", msg.body.id))
                    break;
            }
        }

        let groupConnection;
        let currentGroup;
        let currentChannel;

        $(document).on("click", ".action-button", function (e) {
            e.preventDefault()
            const button = $(this)
            const action = button.attr("data-action")
            const context = button.attr("data-context")
            switch (action) {
                case "channels":
                    if (groupConnection && groupConnection.socket.readyState < 2) groupConnection.socket.close()

                    groupConnection = new SocketConnection(groupsWSLink(context))
                    currentGroup = context;

                    groupConnection.socket.onmessage = (e) => {
                        const msg = JSON.parse(e.data)
                        switch (msg.type) {
                            case "message":
                                if (currentChannel == msg.context) messagesContainer.prepend(buildMessage(msg.body))
                                break;
                            case "channel":
                                channelsContainer.append(buildButton(msg.body.messagesAPIPath, msg.body.name, "messages", msg.body.id))
                                break;
                        }
                    }

                    groupsContainer.find(".action-button").removeClass("active")
                    getChannels(channelsLink(context)).then(channels => { renderChannels(channels) })
                    messageForm.attr("action", "")
                    createChannelButton.attr("href", channelsLink(context)).attr("data-context", context)
                    addMemberButton.attr("href", membersLink(context)).attr("data-context", context)
                    channelsDrawer.show()
                    break;
                case "messages":
                    currentChannel = context;
                    channelsContainer.find(".action-button").removeClass("active")
                    getMessages(messagesLink(context)).then(messages => { renderMessages(messages) })
                    messageForm.attr("action", messagesLink(context))
                    break;
                case "createGroup":
                    createGroup().then(group => { })
                    break;
                case "createChannel":
                    createChannel(channelsLink(context)).then(channel => { })
                    break;
                case "addMember":
                    addMember(membersLink(context)).then(member => {
                        //TODO Success
                    })
                    break;
                case "logout":
                    logout().then(result => {
                        login().then(result => {
                            //TODO Success
                            getGroups().then(groups => { renderGroups(groups) })
                        })
                    })
                    break;
            }
            button.addClass("active")
        })
    }

    checkSession().then(session => {
        if (session) {
            getGroups().then(groups => { renderGroups(groups) })
            listeners()
        } else {
            login().then(result => {
                getGroups().then(groups => {
                    renderGroups(groups)
                    listeners()
                })
            })
        }
    })

})