class PlayerTable{
    constructor(){

        this.tableData = []

        this.headerData = {
            sorted: false,
            ascending: false,
        }

        this.statSelection = ""

        this.attachSortHandler()

    }

    drawTable(){
        let rowSelection = d3.select('#playerTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr')

        rowSelection.selectAll('td')
            .remove()

        let tableDataSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')

        tableDataSelection.selectAll("tr")
            .data(d => [d])
            .join("text")
            .text(d => d.name)
            .on("mouseover", function(d) {
                d3.select('#playerChart').selectAll("rect." + d["target"]["__data__"].name.split(" ")[0])
                    .attr("fill-opacity", .5)
                    .attr("stroke", "rgb(141, 60, 207)")
                    .attr("stroke-width", "1")
            })
            .on("mouseout", function(d) {
                d3.select('#playerChart').selectAll("rect." + d["target"]["__data__"].name.split(" ")[0])
                    .attr("fill-opacity", 1)
                    .attr("stroke", "none")
            })
    }

    rowToCellDataTransform(d){
        return [{name: d.lName + " , " + d.fName}]
    }

    updateTableData(newData, statSelection){
        var arr = []
        for (const player of newData){
            if(player[statSelection] == 0){
                continue
            }

            var keys = Object.keys(player)
            var stringArr = player.Name.split(" ")
            var fName = stringArr[0]
            var lName = stringArr[1]
            var year = +stringArr[stringArr.length - 1]
            var newStat = {year:year}
            var stats = []

            for(var i = 1; i < keys.length; i++){
                newStat[keys[i]] = player[keys[i]]
            }

            const idx = arr.findIndex(d => d.lName === lName)
            if(idx > -1){
                arr[idx].stats.push(newStat)
            }
            else{
                stats.push(newStat)

                var newPlayer = {
                    fName: fName,
                    lName: lName,
                    stats: stats
                }
    
                arr.push(newPlayer)
            }
        }

        arr.sort(compare)

        function compare(a, b) {
            if (a.lName < b.lName) {
                return -1
            }
            if (a.lName > b.lName) {
                return 1
            }
            return 0
        }

        this.tableData = arr
        this.drawTable()
        console.log(this.tableData)
    }

    attachSortHandler(){
        d3.selectAll("table").select("th")
            .on('click', (d) => {
                
                if(this.headerData.ascending){                        
                    this.tableData.sort((a, b) => a.state < b.state ? 1 : -1)
                }
                else {
                    this.tableData.sort((a, b) => a.state < b.state ? -1 : 1)
                }

                //this.drawTable()
            })
    }
}