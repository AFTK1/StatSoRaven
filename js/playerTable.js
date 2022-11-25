class PlayerTable {
    constructor() {

        this.tableData = []
        this.headerData = {
            player: {
                sorted: true,
                ascending: true,
            },
            value: {
                sorted: false,
                ascending: false,

            }
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

        let that = this
        tableDataSelection.selectAll("tr")
            .data(d => [d])
            .join("text")
            .text(function (d) {
                let val = ""
                if (d.hidden == true) {
                    val = "\" \""
                }
                else {
                    val = d.value
                }

                if (that.headerData.value.sorted) {
                    val = d.value
                }

                return val
            })

        rowSelection
            .style("background", function (d) {
                if (d.selection != that.statSelection) {
                    return "rgba(255, 222, 115, 0.5)"
                }

                if (d.hidden == false) {
                    return "rgba(161, 83, 224, 0.25)"
                }
            })
            .on("mouseover", function (d) {
                d3.select('#playerChart').selectAll("rect." + this.__data__.lName)
                    .attr("fill", "#000000")

                if (this.__data__.selection == that.statSelection) {
                    d3.select(this).style("background", "rgb(187, 187, 187)")
                }

            })
            .on("mouseout", function (d) {

                d3.select('#playerChart').selectAll("rect." + this.__data__.lName)
                    .attr("fill", "rgb(141, 60, 207)")

                if (this.__data__.selection == that.statSelection) {
                    if (this.__data__.hidden == false) {
                        d3.select(this).style("background", "rgba(161, 83, 224, 0.25)")
                    }
                    else {
                        d3.select(this).style("background", "none")
                    }
                }



            })
    }

    getTableData() {
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
                stats: stat,
                isNewRow: false
            }

            arr.push(newPlayer)
        }

        arr.sort((a, b) => a.lName < b.lName ? -1 : a.lName > b.lName ? 1 : 0)

        this.tableData = arr
        this.tableDataNoToggle = arr
        this.drawTable()
    }

    attachSortHandler() {
        d3.selectAll("table").selectAll(".sortable")
            .on('click', (d) => {
                let selectedTh = d["srcElement"].innerText

                if (selectedTh === "Player ") {
                    this.headerData.player.sorted = true
                    this.headerData.value.sorted = false

                    if (this.headerData.player.ascending) {
                        this.tableData.sort((a, b) => a.lName < b.lName ? 1 : a.lName > b.lName ? -1 : 0)
                    }
                    else {
                        this.tableData.sort((a, b) => a.lName < b.lName ? -1 : a.lName > b.lName ? 1 : 0)
                    }

                    this.headerData.player.ascending = !this.headerData.player.ascending

                }
                else {
                    this.headerData.value.sorted = true
                    this.headerData.player.sorted = false

                    let selection = this.statSelection

                    if (this.headerData.value.ascending) {
                        this.tableData.sort((a, b) => a.stats[0][selection] < b.stats[0][selection] ? -1 : a.stats[0][selection] > b.stats[0][selection] ? 1 : 0)
                    }
                    else {
                        this.tableData.sort((a, b) => a.stats[0][selection] < b.stats[0][selection] ? 1 : a.stats[0][selection] > b.stats[0][selection] ? -1 : 0)
                    }

                    this.headerData.value.ascending = !this.headerData.value.ascending
                }

                this.collapseAllRows()
                this.drawTable()
                this.updateHeaders()
                globalApplicationState.playerChartState.redrawChart()
            })
    }

    updateHeaders() {

        let playerTh = d3.selectAll('#playerTh')
        let valueTh = d3.selectAll('#valueTh')
        if (this.headerData.player.sorted) {

            playerTh
                .classed('sorting', true)
            valueTh
                .classed('sorting', false)

            if (this.headerData.player.ascending) {
                playerTh.selectAll('i')
                    .classed('no-display', false)
                    .classed('fa-solid fa-sort-down', true)
                    .classed('fa-solid fa-sort-up', false)
            }
            else {
                playerTh.selectAll('i')
                    .classed('no-display', false)
                    .classed('fa-solid fa-sort-down', false)
                    .classed('fa-solid fa-sort-up', true)
            }
            valueTh.selectAll('i')
            .classed('no-display', true)
            .classed('fa-solid fa-sort-down', false)
            .classed('fa-solid fa-sort-up', false)
        }
        else if (this.headerData.value.sorted) {

            playerTh
                .classed('sorting', false)
            valueTh
                .classed('sorting', true)

            if (!this.headerData.value.ascending) {
                valueTh.selectAll('i')
                    .classed('no-display', false)
                    .classed('fa-solid fa-sort-down', true)
                    .classed('fa-solid fa-sort-up', false)
            }
            else {
                valueTh.selectAll('i')
                    .classed('no-display', false)
                    .classed('fa-solid fa-sort-down', false)
                    .classed('fa-solid fa-sort-up', true)
            }
            playerTh.selectAll('i')
            .classed('no-display', true)
            .classed('fa-solid fa-sort-down', false)
            .classed('fa-solid fa-sort-up', false)
        }
    }

    toggleRow(rowData, index) {

        if (rowData.isNewRow == false) {
            if (rowData.isExpanded) {
                this.tableData.splice(index + 1, Object.keys(rowData.stats[0]).length - 2)
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

    collapseAllRows(){
        this.tableData = this.tableData.filter(d => !d.isNewRow)
        this.tableData.forEach(d => {
            d.isExpanded = false
        })
    }
}