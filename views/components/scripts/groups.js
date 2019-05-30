$(document).ready(function(){
    const buildGroupJumbotron = (group) =>{
        const groupJumbotron = $("<div>").addClass("jumbotron jumbotron-fluid")
        const groupContainer = $("<div>").addClass("container")
        groupJumbotron.append(groupContainer)
        groupContainer.append($("<h2>").addClass("display-4").text(group.name))
        groupContainer.append($("<p>").addClass("lead").text(group.description))
        return groupJumbotron
    }

    const buildGroupsContainer = (groups) => {
        const container = $("#groupsContainer")
        for (group of groups){
            container.append($("<div>").addClass("col-4").append(buildGroupJumbotron(group)))
        }
    }

    $.ajax({
        url: "/api/groups",
        method: "GET"
    }).then(function(response){
        console.log(response);
        buildGroupsContainer(response.groups)
    }).catch(function(err){

    })
})