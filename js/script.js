const globalApplicationState = {
    playerData: [],
    teamData: [],
    playerTableState: null,
    playerChartState: null
}

Promise.all([d3.json('./data/scrapedSeasonData.json')]).then(data => {
    globalApplicationState.teamData = data
    var teamChart = new TeamChart(globalApplicationState)
})

Promise.all([d3.json('./data/scrapedPlayerData.json')]).then(data => {
    globalApplicationState.playerData = data

    globalApplicationState.playerTableState = new PlayerTable(globalApplicationState)
    globalApplicationState.playerChartState = new PlayerChart(globalApplicationState)  
})
