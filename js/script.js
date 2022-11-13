Promise.all([d3.json('./data/scrapedSeasonData.json')]).then(data => {
    var teamChart = new TeamChart(data)
})

Promise.all([d3.json('./data/scrapedPlayerData.json')]).then(data => {
    var playerChart = new PlayerChart(data)
    var playerTable = new PlayerTable(data)
})