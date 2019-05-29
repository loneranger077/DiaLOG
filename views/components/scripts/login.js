$(document).on("click", ".toggleLoginForm", function (e) {
    const form = $(this).closest("form")
    let state = "login"
    let action = "/api/login"
    let actionButton = "Login"
    let toggleButton = "Create Account"
    $(".passwordConfirm").addClass("d-none")
    if (form.attr("data-state") === "login") {
        state = "create"
        action = "/api/users"
        actionButton = "Create Account"
        toggleButton = "Existing User"
        $(".passwordConfirm").removeClass("d-none")
    }
    form.attr("data-state", state)
    form.attr("action", action)
    form.find(".actionButton").text(actionButton)
    form.find("h2").text(actionButton)
    form.find(".toggleLoginForm").text(toggleButton)
})