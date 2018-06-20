$(function() {
 
    $("#jsGrid").jsGrid({
        height: "50%",
        width: "70%",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
            
        deleteConfirm: "Do you really want to delete client?",
        controller: {
            loadData: function(filter) {
                return $.ajax({
                    type: "GET",
                    url: "/jobs",
                    data: filter
                });
            },
            insertItem: function(item) {
                return $.ajax({
                    type: "POST",
                    url: "/jobs",
                    data: item
                });
            },
            updateItem: function(item) {
                return $.ajax({
                    type: "PUT",
                    url: "/jobs",
                    data: item
                });
            },
            deleteItem: function(item) {
                return $.ajax({
                    type: "DELETE",
                    url: "/jobs",
                    data: item
                });
            }
        },
        fields:[ 
            { jobtype: "jobtype", type: "text", width: 50 },
            { type: "control" }
        ]
    });
    
});


