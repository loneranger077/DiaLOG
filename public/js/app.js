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