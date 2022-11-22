const globalApplicationState = {
    allData: [],
    tableState: null,
    playerChartState: null
}

Promise.all([d3.json('./data/scrapedSeasonData.json')]).then(data => {
    var teamChart = new TeamChart(data)
})

Promise.all([d3.json('./data/scrapedPlayerData.json')]).then(data => {
    globalApplicationState.allData = data
    globalApplicationState.tableState = new PlayerTable(globalApplicationState)
    globalApplicationState.playerChartState = new PlayerChart(globalApplicationState)  

})

//To Do:
//  * radar chart?
//  * add tooltips
//  * add sorting to table

