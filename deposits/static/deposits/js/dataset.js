$("#dataset-message").html(loadingHTML);
$.get(
{
    url: window.location.origin + window.location.pathname + "json/" + "dataset-limited" + window.location.search,
    success: function (data) {
        renderDatasetPage(data);
        if(data.totals.datasets > 500)
        {
            var html = Mustache.render(templates.warningMessage, {analysis_method:"Datasets", total:data.totals.datasets, allFunction:"datasetsGetAll()"});
            $("#dataset-message").html(html);
        }
        else
        {
            $("#dataset-message").hide();
        }
    }
})

function datasetsGetAll()
{
    $("#dataset-message").html(loadingHTML);
    $.get(
    {
        url: window.location.origin + window.location.pathname + "json/" + "dataset" + window.location.search,
        success: function (data) {
            renderDatasetPage(data);
            $("#dataset-message").hide();
        },
        error: function () {
            var html = Mustache.render(templates.errorMessage);
            $("#dataset-message").html(html);
        }
    })
}

function renderDatasetPage(data)
{
    var dataDict = {
        name: [],
        size: [],
        datasets: [],
        deposits: [],
        directories: [],
        symlinks: [],
        removedDirs: [],
        removedFiles: []
    }

    var body;
    for (var dataset in data.results)
    {
        dataDict.name.push(dataset);
        dataDict.size.push(data.results[dataset].size);
        dataDict.datasets.push(data.results[dataset].datasets);
        dataDict.deposits.push(data.results[dataset].deposits);
        dataDict.directories.push(data.results[dataset].mkdir);
        dataDict.symlinks.push(data.results[dataset].symlink);
        dataDict.removedDirs.push(data.results[dataset].rmdir);
        dataDict.removedFiles.push(data.results[dataset].remove);
        body += Mustache.render(templates.datasetTableBody, {name:dataset, size:formatBytes(data.results[dataset].size), datasets:data.results[dataset].datasets, deposits:data.results[dataset].deposits, directories:data.results[dataset].mkdir, symlinks:data.results[dataset].symlink, removedDirs:data.results[dataset].rmdir, removedFiles:data.results[dataset].remove});
    }
    header = Mustache.render(templates.datasetTableTotals, {totals:"Totals", size:formatBytes(data.totals.size), datasets:data.totals.datasets, deposits:data.totals.deposits, directories:data.totals.mkdir, symlinks:data.totals.symlink, removedDirs:data.totals.rmdir, removedFiles:data.totals.remove});
    $("#datasetTableBody").html(header + body);
    $("#datasetTableTotals").html(header);

    datasetChart = makeDatasetChart(dataDict);

    var activeTab = null;
    if (location.hash) 
    {
        if (location.hash.split(".")[0] != "#dataset")
        {
            activeTab = "datasetTabSize";
        }
        else
        {
            activeTab = location.hash.split(".")[1];
        }
    }
    else
    {
        activeTab = "datasetTabSize";
    }
    datasetChart = updateDatasetChart(datasetChart, activeTab, dataDict);

    datasetTabs = ["datasetTabSize", "datasetTabDatasets", "datasetTabDeposits", "datasetTabDirectories", "datasetTabSymlinks", "datasetTabRmdir", "datasetTabRemoved"]
    $('a[data-toggle="tab-sub"]').on('shown.bs.tab', function (e) {
        if (datasetTabs.includes(e.target.id))
        {
            activeTab = e.target.id;
        }
        datasetChart = updateDatasetChart(datasetChart, activeTab, dataDict);
    })
}

function updateDatasetChart(chart, activeTab, dataDict)
{
    chart.destroy();
    chart = makeDatasetChart(dataDict);
    if(activeTab == "datasetTabSize")
    {
        chart.data.datasets[0].hidden = false;
    }
    if(activeTab == "datasetTabDatasets")
    {
        chart.data.datasets[1].hidden = false;
    }
    if(activeTab == "datasetTabDeposits")
    {
        chart.data.datasets[2].hidden = false;
    }
    if(activeTab == "datasetTabDirectories")
    {
        chart.data.datasets[3].hidden = false;
    }
    if(activeTab == "datasetTabSymlinks")
    {
        chart.data.datasets[4].hidden = false;
    }
    if(activeTab == "datasetTabRmdir")
    {
        chart.data.datasets[5].hidden = false;
    }
    if(activeTab == "datasetTabRemoved")
    {
        chart.data.datasets[6].hidden = false;
    }
    chart.update();
    return chart;
}

function makeDatasetChart(dataDict)
{
    var html = Mustache.render(templates.canvas, {id:"datasetChart"})
    $("#datasetChartBox").html(html);
    var datasetChartElement = $("#datasetChart");
    var datasetChart = new Chart(datasetChartElement, {
        type: 'doughnut',
        data: {
            labels: dataDict.name,
            datasets: [{
                label: 'size',
                data: dataDict.size,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of datasets',
                data: dataDict.datasets,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of deposits',
                data: dataDict.deposits,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of directories',
                data: dataDict.directories,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of symlinks',
                data: dataDict.symlinks,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of removed directories',
                data: dataDict.removedDirs,
                borderWidth: 0,
                hidden: true
            },
            {
                label: '# of removed files',
                data: dataDict.removedFiles,
                borderWidth: 0,
                hidden: true
            }
        ]
        },
        options: {
            responsive: true,
            legend: {
                display: false
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            }
        }
    });
    return datasetChart
}