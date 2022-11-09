Promise.all([d3.json('./data/seasonData.json')]).then( data =>
    {
        var teamChart = new TeamChart(data)
    })