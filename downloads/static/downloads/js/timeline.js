$("#timeline-message").html(loadingHTML);
$.get(
{
    url: window.location.origin + window.location.pathname + "json/" + "timeline" + window.location.search,
    success: function (data) {
        renderTimelinePage(data);
        $("#timeline-message").hide();
    }
})

function renderTimelinePage(data)
{
    var dataDict = {
        months: [],
        users: [],
        methods: [],
        datasets: [],
        accesses: [],
        size: [],
        activitydays: []
    }

    var dataList = [];

    for (var month in data.results)
    {
        var row = [];

        dataDict.months.push(formatDate(month));
        row.push(formatDate(month));
        dataDict.users.push(data.results[month].users);
        row.push(data.results[month].users);
        dataDict.methods.push(data.results[month].methods);
        row.push(data.results[month].methods);
        dataDict.datasets.push(data.results[month].datasets);
        row.push(data.results[month].datasets);
        dataDict.accesses.push(data.results[month].accesses);
        row.push(data.results[month].accesses);
        dataDict.size.push(data.results[month].size);
        row.push(formatBytes(data.results[month].size));
        dataDict.activitydays.push(data.results[month].activitydays);
        row.push(data.results[month].activitydays);

        dataList.push(row);
    }
    
    totals = Mustache.render(templates.timelineTableTotals, {totals:"Totals", users:data.totals.users, methods:data.totals.methods, datasets:data.totals.datasets, accesses:data.totals.accesses, size:formatBytes(data.totals.size), activitydays:data.totals.activitydays});
    
    $("#timelineTable").DataTable({
        data: dataList,
        columns: [
            { title: "Date" },
            { title: "Users" },
            { title: "Methods" },
            { title: "Datasets" },
            { title: "Number of accesses" },
            { title: "Size" },
            { title: "Activity days"}
        ],
        columnDefs: [
            { type: 'file-size', targets: 5 }
          ]
    })
    
    $("#timelineTableTotals").html(totals);

    timelineChart = makeTimelineChart(dataDict);

    var activeTab = null;
    if (location.hash) 
    {
        if (location.hash.split(".")[0] != "#timeline")
        {
            activeTab = "timelineTabUsers";
        }
        else
        {
            activeTab = location.hash.split(".")[1];
        }
    }
    else
    {
        activeTab = "timelineTabUsers";
    }
    timelineChart = updateTimelineChart(timelineChart, activeTab, dataDict);


    timelineTabs = ["timelineTabUsers", "timelineTabMethods", "timelineTabDatasets", "timelineTabAccesses", "timelineTabSize", "timelineTabActivitydays"]
    $('a[data-toggle="tab-sub"]').on('shown.bs.tab', function (e) {
        if (timelineTabs.includes(e.target.id))
        {
            activeTab = e.target.id;
        }
        timelineChart = updateTimelineChart(timelineChart, activeTab, dataDict);
    })
}

function updateTimelineChart(chart, activeTab, dataDict)
{
    chart.destroy();
    chart = makeTimelineChart(dataDict);
    if(activeTab == "timelineTabUsers")
    {
        chart.data.datasets[0].hidden = false;
    }
    if(activeTab == "timelineTabMethods")
    {
        chart.data.datasets[1].hidden = false;
    }
    if(activeTab == "timelineTabDatasets")
    {
        chart.data.datasets[2].hidden = false;
    }
    if(activeTab == "timelineTabAccesses")
    {
        chart.data.datasets[3].hidden = false;
    }
    if(activeTab == "timelineTabSize")
    {
        chart.data.datasets[4].hidden = false;
    }
    if(activeTab == "timelineTabActivitydays")
    {
        chart.data.datasets[5].hidden = false;
    }
    chart.update();
    return chart;
}

function makeTimelineChart(dataDict)
{
    var timelineChartElement = $("#timelineChart");
    var timelineChart = new Chart(timelineChartElement, {
        type: 'line',
        data: {
            labels: dataDict.months,
            datasets: [{
                label: '# of users',
                data: dataDict.users,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            },
            {
                label: '# of methods',
                data: dataDict.methods,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            },
            {
                label: '# of datasets',
                data: dataDict.datasets,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            },
            {
                label: '# of accesses',
                data: dataDict.accesses,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            },
            {
                label: 'size',
                data: dataDict.size,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            },
            {
                label: '# of activity days',
                data: dataDict.activitydays,
                fill: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                borderWidth: 1,
                hidden: true
            }
        ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    return timelineChart
}
