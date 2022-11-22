class PlayerTable {
    constructor() {

        this.tableData = []

        this.headerData = {
            sorted: false,
            ascending: false,
        }

        this.statSelection = ""

        this.attachSortHandler()

    }

    drawTable() {

        let rowSelection = d3.select('#playerTableBody')
            .selectAll('tr')
            .data(this.tableData)
            .join('tr')

        rowSelection.selectAll('td')
            .remove()

        rowSelection.on('click', (event, d) => {
            this.toggleRow(d, this.tableData.indexOf(d));
        });

        let tableDataSelection = rowSelection.selectAll('td')
            .data(this.rowToCellDataTransform)
            .join('td')

        tableDataSelection.selectAll("tr")
            .data(d => [d])
            .join("text")
            .text(function (d) {
                if (d.hidden == true) {
                    return "\" \""
                }
                else{
                    return d.value
                }
            })


        let that = this
        rowSelection
            .style("background", function(d) {
                if(d.selection != that.statSelection){
                    return "rgba(255, 222, 115, 0.5)"
                }

                if(d.hidden == false){
                    return "rgba(161, 83, 224, 0.25)"
                }
            })
            .on("mouseover", function (d) {
                d3.select('#playerChart').selectAll("rect." + this.__data__.lName)
                .attr("fill", "#000000")
                
                if(this.__data__.selection == that.statSelection){
                    d3.select(this).style("background", "rgb(187, 187, 187)")
                }

            })
            .on("mouseout", function (d) {

                d3.select('#playerChart').selectAll("rect." + this.__data__.lName)
                .attr("fill", "rgb(141, 60, 207)")

                if(this.__data__.selection == that.statSelection){
                    if(this.__data__.hidden == false){
                        d3.select(this).style("background", "rgba(161, 83, 224, 0.25)")
                    }
                    else{
                        d3.select(this).style("background", "none")
                    }
                }



            })
    }

    getTableData(){
        return this.tableData
    }

    rowToCellDataTransform(d) {
        var selection = d.selection
        let player = { type: "player", value: d.lName + " , " + d.fName, hidden: d.hidden, }
        let stat = { type: "stat", value: selection + " in " + d.stats[0].year }
        let value = { type: "value", value: d.stats[0][selection] }
        return [player, stat, value]
    }

    updateTableData(newData, statSelection) {
        this.statSelection = statSelection
        var arr = []
        for (const player of newData) {
            if (player[statSelection] <= 0) {
                continue
            }

            var keys = Object.keys(player)
            var stringArr = player.Name.split(" ")
            var fName = stringArr[0]
            var lName = stringArr[1]
            var year = +stringArr[stringArr.length - 1]
            var newStat = { year: year }
            var stat = []
            var hidden = false

            for (var i = 1; i < keys.length; i++) {
                newStat[keys[i]] = player[keys[i]]
            }

            const idx = arr.findIndex(d => d.lName === lName)
            if (idx > -1) {
                hidden = true
            }

            stat.push(newStat)

            var newPlayer = {
                fName: fName,
                lName: lName,
                hidden: hidden,
                selection: statSelection,
                isExpanded: false,
                stats: stat
            }

            arr.push(newPlayer)
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
    }

    attachSortHandler() {
        d3.selectAll("table").select("th")
            .on('click', (d) => {

                if (this.headerData.ascending) {
                    this.tableData.sort((a, b) => a.state < b.state ? 1 : -1)
                }
                else {
                    this.tableData.sort((a, b) => a.state < b.state ? -1 : 1)
                }

                //this.drawTable()
            })
    }

    toggleRow(rowData, index) {
        //console.log("after click")
        if(rowData.isNewRow == undefined){
            if (rowData.isExpanded) {
                this.tableData.splice(index + 1, Object.keys(rowData.stats[0]).length-2)
                rowData.isExpanded = false
            }
            else {
                for (const stat of Object.keys(rowData.stats[0])) {
                    if (stat != rowData.selection && stat != "year") {
    
                        var newRow = {
                            fName: rowData.fName,
                            lName: rowData.fName,
                            hidden: true,
                            selection: stat,
                            isExpanded: false,
                            stats: rowData.stats,
                            isNewRow: true
                        }
                        this.tableData.splice(++index, 0, newRow)                  
                    }
                }
                rowData.isExpanded = true
            }
            this.drawTable()
        }


    }
}