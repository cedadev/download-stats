$("#timeline-message").html(loadingHTML);
$.get(
{
    url: window.location.origin + window.location.pathname + "json/" + "timeline" + window.location.search,
    success: function(data) 
    {
        renderTimelinePage(data);
        $("#timeline-message").hide();
    }
})

function renderTimelinePage(data)
{
    var dataDict = {
        days: [],
        size: [],
        datasets: [],
        deposits: [],
        directories: [],
        symlinks: [],
        removedDirs: [],
        removedFiles: []
    }

    var dataList = [];

    for (var day in data.results)
    {
        var row = [];

        dataDict.days.push(formatDate(day));
        row.push(formatDate(day));
        dataDict.size.push(data.results[day].size);
        row.push(formatBytes(data.results[day].size));
        dataDict.datasets.push(data.results[day].datasets);
        row.push(data.results[day].datasets);
        dataDict.deposits.push(data.results[day].deposits);
        row.push(data.results[day].deposits);
        dataDict.directories.push(data.results[day].mkdir);
        row.push(data.results[day].mkdir);
        dataDict.symlinks.push(data.results[day].symlink);
        row.push(data.results[day].symlink);
        dataDict.removedDirs.push(data.results[day].rmdir);
        row.push(data.results[day].rmdir);
        dataDict.removedFiles.push(data.results[day].remove);
        row.push(data.results[day].remove);

        dataList.push(row);
    }

    totals = Mustache.render(templates.tableTotals, {totals:"Totals", size:formatBytes(data.totals.size), datasets:data.totals.datasets, deposits:data.totals.deposits, directories:data.totals.mkdir, symlinks:data.totals.symlink, removedDirs:data.totals.rmdir, removedFiles:data.totals.remove});
    
    $("#timelineTable").DataTable({
        data: dataList,
        columns: [
            { title: "Date" },
            { title: "Size" },
            { title: "Datasets" },
            { title: "Deposits" },
            { title: "Directories" },
            { title: "Symlinks" },
            { title: "Removed directories" },
            { title: "Removed files" }
        ],
        columnDefs: [
            { type: 'file-size', targets: 1 }
          ]
    })
    
    $("#timelineTableTotals").html(totals);

    timelineChart = makeTimelineChart(dataDict);
}

function makeTimelineChart(dataDict)
{
    var timelineChartElement = $("#timelineChart");
    var timelineChart = new Chart(timelineChartElement, {
        type: "line",
        data: {
            labels: dataDict.days,
            datasets: [{
                label: "size",
                yAxisID: "size",
                data: dataDict.size,
                fill: false,
                showLine: false,
                borderColor: "#00628d",
                backgroundColor: "#00628d",
                pointBackgroundColor: "#00628d",
                pointBorderColor: "#00628d",
                borderWidth: 1,
                hidden: false
            },
            {
                label: "# of deposits",
                yAxisID: "deposits",
                data: dataDict.deposits,
                fill: false,
                showLine: false,
                borderColor: "#E33C4F",
                backgroundColor: "#E33C4F",
                pointBackgroundColor: "#E33C4F",
                pointBorderColor: "#E33C4F",
                borderWidth: 1,
                hidden: false
            }
        ]
        },
        options: {
            responsive: true,
            legend: {
                display: true
            },
            scales: {
                yAxes: [{
                    id: "size",
                    type: "linear",
                    position: "left",
                    labelString: "Size",
                    ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            return formatBytes(value);
                        }
                    }
                },
                {
                    id: "deposits",
                    type: "linear",
                    position: "right",
                    labelString: "Deposits",
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    return timelineChart
}
