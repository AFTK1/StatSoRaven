Promise.all([d3.json('./data/scrapedSeasonData.json')]).then( data =>
    {
        var teamChart = new TeamChart(data)
    })