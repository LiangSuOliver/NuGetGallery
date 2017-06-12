﻿var renderGraph = function (baseUrl, query, clickedId) {
    var renderGraphHandler = function (rawData) {
        var data = JSON.parse(JSON.stringify(rawData));

        $("#loading-placeholder").hide();
        // Populate the data table
        data['reportSize'] = data.Table.length;

        ko.applyBindings({ report: data });
        // Render the graph using the data table
        packageDisplayGraphs(rawData);

        window.nuget.configureExpander("hidden-row", "Show less", "Show more");

        // Add the click handler to the checkboxes
        groupbyNavigation(baseUrl);

        // Set the focus to the checkbox that initiated this request
        if (clickedId) {
            $('#' + clickedId).focus();
        }
    }

    $.ajax({
        url: baseUrl + query,
        type: 'GET',
        dataType: 'json',
        success: renderGraphHandler,
        error: function () {
            renderGraphHandler(null);
            $("#loading-placeholder").hide();

            $('#statistics-retry').click(function () {
                renderGraph(baseUrl, query);
            });
        }
    });
}

var groupbyNavigation = function (baseUrl) {
    $('.dimension-checkbox').click(function (event) {
        var container = $("#stats-data-display").parent();
        $("#stats-data-display").remove();
        $("#loading-placeholder").show();
        var clickedId = event.target.id;

        var query = '';
        $('.dimension-checkbox').each(function (index, element) {
            if (element.checked) {
                if (query) {
                    query += '&';
                } else {
                    query = '?';
                }
                query += 'groupby=' + element.value;
            }
        });

        history.replaceState({}, "", query);
        renderGraph(baseUrl, query, clickedId);
    });
}