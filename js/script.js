Promise.all([d3.json('./data/scrapedSeasonData.json')]).then(data => {
    var teamChart = new TeamChart(data)
})

Promise.all([d3.json('./data/scrapedPlayerData.json')]).then(data => {
    var playerChart = new PlayerChart(data)
    var playerTable = new PlayerTable(data)
})

//To Do:
//  * change area chart color
//  * have a default chart/ stat selection
//  * add y axis label
//  * remove players x axis label
//  * limit data range selection or only allow two seasons to be compared
//  * dont reset category/statistic selection when range or categoery is selected for either chart, 
//      display new data according to new range/cat
//  * add player table, on player selection expand row to display players other statistics
//  * group players together and then sort by season
//  * include intro section to explain site
//  * clicking on parts of intro section takes you to appropiate visualization
//  * radar chart for team statistics 
