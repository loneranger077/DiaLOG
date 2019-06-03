$(document).ready(function () {

    // submits a form through ajax and triggers the success event
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
            form[0].reset();
            form.trigger("success", [response])
        }).catch(function (error) {
            console.log(error);
        });
    });

    // creates a socket connection for a given path
    const SocketConnection = function(path) {
        this.socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
        this.socketUrl = `${this.socketProtocol}//${window.location.hostname}:${location.port}${path}`
        this.socket = new WebSocket(this.socketUrl);
    }

    // constructs the app
    const App = function(){

        // selectors for the buttons, forms, and containers
        const groupsContainer = $("#groups > ul")
        const channelsDrawer = $("#channels").hide()
        const channelsContainer = $("#channels > ul")
        const messagesContainer = $("#view > .messages > .list-group")
        const messageForm = $("#message-form")
        const createChannelButton = $("#create-channel-button")
        const addMemberButton = $("#add-member-button")
        const logoutForm = $("#logout-form")

        //request links for api
        const groupsLink = (channel) => { return `/api/groups` }
        const groupsWSLink = (group) => { return `/ws/groups/${group}` }
        const WSLink = () => { return `/ws` }
        const membersLink = (group) => { return `/api/members/${group}` }
        const channelsLink = (group) => { return `/api/channels/${group}` }
        const messagesLink = (channel) => { return `/api/messages/${channel}` }

        // constructs the session 
        this.Session = function() {

            this.genSocket;
            this.groupSocket;
            this.currentGroup;
            this.currentChannel;

            this.onSocket = (message) => {};

            // renders the groups
            const groups = () => {
                getGroups().then(groups => { renderGroups(groups) })
            }
            
            // show login modal
            const login = () => {
                return loginModal().then(result => {
                    this.refreshGeneralSocket()
                    groups()
                })
            }
            
            // logout then show login modal
            this.logout = () => {
                logout().then(result => {
                    login()
                })
            }

            // refreshes the general websocket
            this.refreshGeneralSocket = () => {
                if (this.genSocket && this.genSocket.socket.readyState < 2) this.genSocket.socket.close()
                this.genSocket = new SocketConnection(WSLink())

                this.genSocket.socket.onmessage = (e) => {
                    const message = JSON.parse(e.data)
                    this.onSocket(message)
                }
            }

            // refreshes the group websocket
            this.refreshGroupSocket = (group) => {
                if (this.groupSocket && this.groupSocket.socket.readyState < 2) this.groupSocket.socket.close()
                this.groupSocket = new SocketConnection(groupsWSLink(group))

                this.groupSocket.socket.onmessage = (e) => {
                    const message = JSON.parse(e.data)
                    this.onSocket(message)
                }
            }

            // checks the status of the server session
            this.check = () => {
                const context = this
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: "/api/session",
                        method: "GET"
                    }).then(function (response) {
                        context.refreshGeneralSocket()
                        groups()
                        resolve()
                    }).catch(function (error) {
                        if (error.responseJSON.active === false) {
                            login().then(() => {
                                resolve()
                            })
                        } else {
                            reject(error);
                        }
                    });
                })
            }

        }

        // initiates the application
        this.start = () => {

            const session = new this.Session()
            session.check().then(() => {
                listeners(session)
            })
        }

        // listens for input and connects to socketss
        const listeners = (session) => {

            const socketHandler = (message) => {
                switch (message.type) {
                    case "message":
                        if (currentChannel == message.context) messagesContainer.prepend(buildMessage(message.body))
                        break;
                    case "channel":
                        channelsContainer.append(buildButton(message.body.messagesAPIPath, message.body.name, "messages", message.body.id))
                        break;
                    case "member":
                        groupsContainer.append(buildButton(message.body.channelsAPIPath, message.body.name, "channels", message.body.id))
                        break;
                }
            }

            session.onSocket = socketHandler

            $(document).on("click", ".action-button", function (e) {
                e.preventDefault()
                const button = $(this)
                const action = button.attr("data-action")
                const context = button.attr("data-context")
                switch (action) {
                    case "channels": 
                        session.refreshGroupSocket(context)
                        groupsContainer.find(".action-button").removeClass("active")
                        getChannels(channelsLink(context)).then(channels => { 
                            channelsContainer.find("li:not(.static)").remove()
                            messagesContainer.find(".list-group-item").remove()
                            for (channel of channels) {
                                channelsContainer.append(buildButton(channel.messagesAPIPath, channel.name, "messages", channel.id))
                            }
                        })
                        messageForm.attr("action", "")
                        createChannelButton.attr("href", channelsLink(context)).attr("data-context", context)
                        addMemberButton.attr("href", membersLink(context)).attr("data-context", context)
                        channelsDrawer.show()
                        break;
                    case "messages":
                        currentChannel = context;
                        channelsContainer.find(".action-button").removeClass("active")
                        getMessages(messagesLink(context)).then(messages => { 
                            messagesContainer.find(".list-group-item").remove()
                            for (message of messages) {
                                messagesContainer.prepend(buildMessage(message.body))
                            }
                        })
                        messageForm.attr("action", messagesLink(context))
                        break;
                    case "createGroup":
                        createGroupModal().then(group => { })
                        break;
                    case "createChannel":
                        createChannelModal(channelsLink(context)).then(channel => { })
                        break;
                    case "addMember":
                        addMemberModal(membersLink(context)).then(member => { })
                        break;
                    case "logout":
                        session.logout()
                        break;
                }
                button.addClass("active")
            })

            $(document).on("click", ".edit-channel-button", function (e) {

        }

        $(document).on("click", ".edit-group-button", function (e) {

        }

        // renders the groups into the groupsContainer
        const renderGroups = (groups) => {
            groupsContainer.find("li:not(.static)").remove()
            for (group of groups) {
                groupsContainer.append(buildButton(group.channelsAPIPath, group.name, "channels", group.id))
            }
        }

        // constructs the button for channels 
        const buildButton = (link, text, action, id) => {
            const buttonContainer = $("<li>").addClass("nav-item")
            buttonContainer.append($("<a>")
                .addClass("nav-link action-button")
                .attr("href", link)
                .attr("data-context", id)
                .attr("data-action", action).text(text))
            return buttonContainer
        }

        // constructs the message and puts it in the message div
        const buildMessage = (message) => {
            const messageContainer = $("<li>").addClass("list-group-item").html()
            return messageContainer
        }

        // gets the messages for a given channel
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

        // gets the channels for a given group
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

        // gets the groups for the current session user
        const getGroups = () => {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: groupsLink(),
                    method: "GET"
                }).then(function (response) {
                    resolve(response.groups);
                }).catch(function (error) {
                    reject(error);
                });
            })
        }

        // shows the create group modal and waits for form success
        const createGroupModal = () => {
            return new Promise(function (resolve, reject) {
                const modal = $("#createGroupModal")
                modal.modal('show')

                modal.find("form").on("success", function (e, result) {
                    modal.modal('hide')
                    resolve(result.group)
                    $(this).on("success", function () { return false; });
                })
            })
        }

        // shows the create channle modal and waits for form success
        const createChannelModal = (link) => {
            return new Promise(function (resolve, reject) {
                const modal = $("#createChannelModal")
                modal.modal('show')

                modal.find("form").attr("action", link).on("success", function (e, result) {
                    modal.modal('hide')
                    resolve(result.channel)
                    $(this).on("success", function () { return false; });
                })
            })
        }

        // shows the add member modal and waits for form success
        const addMemberModal = (link) => {
            return new Promise(function (resolve, reject) {
                const modal = $("#addMemberModal")
                modal.modal('show')

                modal.find("form").attr("action", link).on("success", function (e, result) {
                    modal.modal('hide')
                    resolve(result.member)
                    $(this).on("success", function () { return false; });
                })
            })
        }

        // shows the login modal and waits for form success
        const loginModal = () => {
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
                    $(modal).off("click", ".toggleLoginForm")
                    $(this).on("success", function () { return false; });
                })
            })
        }

        // submits the login form
        const logout = () => {
            return new Promise(function (resolve, reject) {
                logoutForm.submit()
                logoutForm.on("success", function (e, result) {
                    resolve(result)
                    $(this).on("success", function () { return false; });
                })
            })
        }
    }

    const app = new App()

    app.start()
})