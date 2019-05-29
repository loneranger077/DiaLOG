$(document).ready(function(){
    $.ajax({
        url: "/api/groups",
        method: "GET"
    }).then(function(response){
        console.log(response);
    }).catch(function(err){

    })
})