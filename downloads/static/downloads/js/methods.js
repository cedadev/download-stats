$("#methods-message").html(loadingHTML);
$.get(
{
    url: window.location.origin + window.location.pathname + "json/" + "methods" + window.location.search,
    success: function(data) 
    {
        renderMethodsPage(data);
        $("#methods-message").hide();
    }
})

function renderMethodsPage(data)
{
    var dataDict = {
        users: [],
        methods: [],
        datasets: [],
        accesses: [],
        size: [],
        activitydays: []
    }

    var html;
    for (var method in data.results)
    {
        dataDict.methods.push(method);
        dataDict.users.push(data.results[method].users);
        dataDict.datasets.push(data.results[method].datasets);
        dataDict.accesses.push(data.results[method].accesses);
        dataDict.size.push(data.results[method].size);
        dataDict.activitydays.push(data.results[method].activitydays);
        html += Mustache.render(templates.methodsTableBody, {method:method, users:data.results[method].users, datasets:data.results[method].datasets, accesses:data.results[method].accesses, size:formatBytes(data.results[method].size), activitydays:data.results[method].activitydays});
    }
    $("#methodsTableBody").html(html);
    html = Mustache.render(templates.methodsTableFooter, {totals:"Totals", users:data.totals.users, datasets:data.totals.datasets, accesses:data.totals.accesses, size:formatBytes(data.totals.size), activitydays:data.totals.activitydays});
    $("#methodsTableFooter").html(html);

    methodsChart = makeMethodsChart(dataDict);

    var activeTab = null;
    if (location.hash)
    {
        if (location.hash.split(".")[0] != "#methods")
        {
            activeTab = "methodsTabUsers";
        }
        else
        {
            activeTab = location.hash.split(".")[1];
        }
    }
    else
    {
        activeTab = "methodsTabUsers";
    }
    methodsChart = updateMethodsChart(methodsChart, activeTab, dataDict);

    methodsTabs = ["methodsTabUsers", "methodsTabMethods", "methodsTabDatasets", "methodsTabAccesses", "methodsTabSize", "methodsTabActivitydays"]
    $('a[data-toggle="tab-sub"]').on('shown.bs.tab', function (e) {
        if (methodsTabs.includes(e.target.id))
        {
            activeTab = e.target.id;
        }
        methodsChart = updateMethodsChart(methodsChart, activeTab, dataDict);
    })
}

function updateMethodsChart(chart, activeTab, dataDict)
{
    chart.destroy();
    chart = makeMethodsChart(dataDict);
    if(activeTab == "methodsTabUsers")
    {
        chart.data.datasets[0].hidden = false;
    }
    if(activeTab == "methodsTabDatasets")
    {
        chart.data.datasets[1].hidden = false;
    }
    if(activeTab == "methodsTabAccesses")
    {
        chart.data.datasets[2].hidden = false;
    }
    if(activeTab == "methodsTabSize")
    {
        chart.data.datasets[3].hidden = false;
    }
    if(activeTab == "methodsTabActivitydays")
    {
        chart.data.datasets[4].hidden = false;
    }
    chart.update();
    return chart;
}

function makeMethodsChart(dataDict)
{
    var methodsChartElement = $("#methodsChart");
    var methodsChart = new Chart(methodsChartElement, {
        type: 'bar',
        data: {
            labels: dataDict.methods,
            datasets: [{
                label: '# of users',
                data: dataDict.users,
                hidden: true
            },
            {
                label: '# of datasets',
                data: dataDict.datasets,
                hidden: true
            },
            {
                label: '# of accesses',
                data: dataDict.accesses,
                hidden: true
            },
            {
                label: 'size',
                data: dataDict.size,
                hidden: true
            },
            {
                label: '# of activity days',
                data: dataDict.activitydays,
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
                }],
                xAxes: [{
                    ticks: {
                      autoSkip: false
                    }
                  }]
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Pastel1-9'
                }
            }
        }
    });
    return methodsChart
}