
class PlayerChart {
    constructor(data) {

        this.chartData = [...data[0]]
        this.padding = {
            left: 100,
            right: 30,
            top: 15,
            bottom: 130
        }
        this.chart = {
            width: 1100,
            height: 600
        }

        this.categories = {
            "Passing": ["Completions", "Yards", "Yards Per Game", "Longest Pass"],
            "Rushing": ["Yards", "Yards Per Rush Attempt"],
            "Receiving": ["Receptions", "Yards", "Longest Reception", "Fumbles"],
            "Defense": ["Tackles", "Sacks", "Interceptions", "Forced Fumbles"],
            "Scoring": ["Rushing Touchdowns", "Receiving Touchdowns", "Return Touchdowns", "Total Touchdowns", "Total Points"]
        }

        this.category = "Passing"
        this.selection = "Completions"
        this.isRangeSelected = true
        this.seasons = this.chartData.map(function (d) {
            return d.Year
        })

        this.newRange = []
        this.currentRange = [2020, 2021, 2022]
        this.firstYear = 2004
        this.secondYear = 2021

        this.svg = d3.selectAll("#playerChart")
            .attr("width", "100%")
            .attr("height", this.chart.height)


        this.isAreaShowing = false
        this.scaleY = d3.scaleLinear()
            .range([this.chart.height - this.padding.bottom, this.padding.top])

        this.scaleX = d3.scaleBand()
            // .domain([2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
            //     2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022])
            .range([this.padding.left, this.chart.width - this.padding.right]).padding(0.2)

        this.attatchHandlers()
    }

    attatchHandlers() {

        this.attachSeasonHandler()
        this.attachSeasonSpecificHandler()
        this.secondSeasonSpecificHandler()
        this.attachCategoryHandler()
        this.attatchArrowHandler()
        this.drawAxis()
        this.updateChartData("Completions", "Passing")
        this.attachStatisticHandler("Passing")
    }

    attatchArrowHandler() {
        let that = this
        d3.selectAll(".real-checkbox")
            .on("click", function (d) {
                let checked = this.checked

                let specificDropdowns = d3.selectAll(".specific")
                let rangeDropdowns = d3.selectAll(".range")
                if (checked) {
                    specificDropdowns
                        .classed("disabled", false)

                    rangeDropdowns
                        .classed("disabled", true)

                    that.isRangeSelected = false

                    that.updateChartData(that.selection, that.category)
                }
                else {

                    specificDropdowns
                        .classed("disabled", true)

                    rangeDropdowns
                        .classed("disabled", false)

                    that.isRangeSelected = true

                    that.updateChartData(that.selection, that.category)
                }

            })
    }

    drawAxis() {
        var y_axis = d3.axisLeft()
            .scale(this.scaleY)

        var x_axis = d3.axisBottom()
            .scale(this.scaleX)

        this.svg.selectAll('text,.tick').remove()

        this.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("y", 25)
            .attr("x", -250)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(this.selection)

        this.svg.append('g')
            .attr('transform', 'translate(' + this.padding.left + ',0)')
            .transition()
            .duration(1500)
            .call(y_axis)

        this.svg.append('g')
            .attr('transform', 'translate(0,' + (this.chart.height - this.padding.bottom) + ')')
            .transition()
            .duration(1500)
            .call(x_axis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", -10)
            .attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end");
    }

    attachSeasonHandler() {

        //range dropdowns
        let seasonDropdowns = d3.select(".dropdown" && ".season" && ".range")
        let firstSeasonButton = seasonDropdowns.select(".dropdown" && ".firstSeasonButton")
        let secondSeasonButton = seasonDropdowns.select(".dropdown" && ".secondSeasonButton")

        let seasons = this.seasons


        seasonDropdowns.select(".firstSeasonList")
            .selectAll('dropdown-item')
            .data(seasons)
            .enter()
            .append('a')
            .text((d) => d)
            .attr('class', 'dropdown-item')

        let firstSeasonList = seasonDropdowns.selectAll(".firstSeasonList").selectAll('.dropdown-item')

        let that = this
        firstSeasonList
            .on('click', function () {

                //that.svg.selectAll('.chartPath').remove()
                var startingyear = this.text
                firstSeasonButton
                    .text(startingyear)

                that.svg.selectAll('rect').remove()

                secondSeasonButton
                    .text('Season')

                // d3.select(".dropdown" && ".playerCategory").select('.btn')
                //     .text('Category')

                // d3.select(".dropdown" && ".playerStatistic").select('.btn')
                //     .text('Statistic')

                let followingYears = that.seasons.filter(function (d) {
                    return +startingyear <= +d && +d <= +startingyear + 2
                })

                that.newRange = followingYears

                let items = seasonDropdowns.selectAll('.secondSeasonList')

                items.selectAll('a').remove()

                items.selectAll('dropdown-item')
                    .data(followingYears)
                    .enter()
                    .append('a')
                    .text((d) => d)
                    .attr('class', 'dropdown-item')

                that.secondSeasonHandler()
            })        
    }

    secondSeasonHandler() {

        //range dropdowns
        let seasonDropdowns = d3.select(".dropdown" && ".season" && ".range")
        let secondSeasonButton = seasonDropdowns.select(".dropdown" && ".secondSeasonButton")
        let secondSeasonList = seasonDropdowns.selectAll(".secondSeasonList").selectAll('.dropdown-item')

        let that = this
        secondSeasonList
            .on('click', function () {
                //that.svg.selectAll('.chartPath').remove()

                that.svg.selectAll('rect').remove()
                that.svg.selectAll('.tick').remove()

                let endingYear = this.text
                secondSeasonButton
                    .text(endingYear)

                that.currentRange = that.newRange.filter(function (d) {
                    return +endingYear >= +d
                })

                that.updateChartData(that.selection, that.category)
            })
    }

    attachSeasonSpecificHandler() {

        //range dropdowns
        let seasonDropdowns = d3.select(".dropdown" && ".season"  && ".specific")
        let firstSeasonButton = seasonDropdowns.select(".dropdown" && ".firstSeasonButton")
        let secondSeasonButton = seasonDropdowns.select(".dropdown" && ".secondSeasonButton")

        let seasons = this.seasons


        seasonDropdowns.select(".firstSeasonList")
            .selectAll('dropdown-item')
            .data(seasons)
            .enter()
            .append('a')
            .text((d) => d)
            .attr('class', 'dropdown-item')

        seasonDropdowns.selectAll('.secondSeasonList')
            .selectAll('dropdown-item')
            .data(seasons)
            .enter()
            .append('a')
            .text((d) => d)
            .attr('class', 'dropdown-item')

        let firstSeasonList = seasonDropdowns.selectAll(".firstSeasonList").selectAll('.dropdown-item')

        let that = this
        firstSeasonList
            .on('click', function () {

                //that.svg.selectAll('.chartPath').remove()
                var firstYear = this.text

                firstSeasonButton
                    .text(firstYear)

                that.svg.selectAll('rect').remove()

                that.firstYear = +firstYear

                that.updateChartData(that.selection, that.category)
            })        
    }

    secondSeasonSpecificHandler() {

        //range dropdowns
        let seasonDropdowns = d3.select(".dropdown" && ".season" && ".specific")
        let secondSeasonButton = seasonDropdowns.select(".dropdown" && ".secondSeasonButton")
        let secondSeasonList = seasonDropdowns.selectAll(".secondSeasonList").selectAll('.dropdown-item')

        let that = this
        secondSeasonList
            .on('click', function () {
                //that.svg.selectAll('.chartPath').remove()

                that.svg.selectAll('rect').remove()
                that.svg.selectAll('.tick').remove()

                let secondYear = this.text

                secondSeasonButton
                    .text(secondYear)

                that.secondYear = +secondYear
                that.updateChartData(that.selection, that.category)
                })         
    }


    attachCategoryHandler() {
        let categoryDropDown = d3.select(".dropdown" && ".playerCategory")
        let statisticDropDown = d3.select(".dropdown" && ".playerStatistic")
        let categoryDropDownItems = categoryDropDown.selectAll('.dropdown-item')

        let categories = this.categories

        let that = this
        categoryDropDownItems
            .on('click', function () {

                that.svg.selectAll('rect').remove()
                
                document.getElementById("toggle").checked = false
                categoryDropDown.select('.btn')
                    .text(this.text)

                that.category = this.text
                let stats = categories[this.text]

                let items = statisticDropDown.select(".dropdown-menu")

                items.selectAll('a').remove()

                items.selectAll('dropdown-item')
                    .data(stats)
                    .enter()
                    .append('a')
                    .text((d) => d)
                    .attr('class', 'dropdown-item')

                console.log(this.text)
                that.attachStatisticHandler(this.text)
            })
    }

    attachStatisticHandler(category) {
        let statisticDropDown = d3.select(".dropdown" && ".playerStatistic")
        let statisticDropDownItems = statisticDropDown.selectAll('.dropdown-item')

        let that = this

        statisticDropDownItems
            .on('click', function () {
                document.getElementById("toggle").checked = false

                that.selection = this.text

                statisticDropDown.select('.btn')
                    .text(this.text)

                that.updateChartData(this.text, category)
            })


    }

    updateChartData(selection, category) {
        selection = selection.replace(/\s/g, "")
        var that = this

        var selectedSeasonData = []
        if(this.isRangeSelected){
            selectedSeasonData = this.chartData.filter(function (d) {
                return that.currentRange.includes(d.Year)
            })
        }
        else{
            selectedSeasonData = this.chartData.filter(function (d) {
                return d.Year == that.firstYear || d.Year == that.secondYear
            })
        }

        var selectedData = []
        selectedSeasonData.forEach(season => {
            selectedData = [...selectedData, ...season[category]]
        });

        var newData = selectedData.map(function (d) {
            var stringArr = d.Name.split(" ")
            var dx = stringArr[1] + " " + stringArr[stringArr.length - 1]
            return {
                x: dx,
                y: d[selection]
            }
        })
        
        this.drawChart(newData)
    }

    drawChart(data) {
        var filteredData = data.filter(function (d) { return d.y > 0 })
        this.scaleX
            .domain(filteredData.map(function (d) {
                return d.x
            }))

        this.scaleY
            .domain([0, d3.max(filteredData, function (d) {
                return d.y
            })])

        this.drawAxis()

        this.svg.selectAll("rect")
            .remove().exit()

        let that = this

        if (filteredData.length > 150) {
            this.svg.selectAll('rect')
                .data(filteredData)
                .enter()
                .append('rect')
                .attr('fill', 'rgb(141, 60, 207)')
                .attr('x', function (d) { return that.scaleX(d.x) })
                .attr('y', function (d) { return +d.y < 0 ? 0 : that.scaleY(d.y) })
                .attr('width', that.scaleX.bandwidth())
                .attr('height', function (d) { return +d.y < 0 ? 0 : ((that.chart.height - that.padding.bottom) - (that.scaleY(d.y))) })
        }
        else {
            this.svg.selectAll('rect')
                .data(filteredData)
                .enter()
                .append('rect')
                .attr('fill', 'rgb(141, 60, 207)')
                .attr('x', function (d) { return that.scaleX(d.x) })
                .attr('y', function (d) { return that.scaleY(0) })
                .attr('width', that.scaleX.bandwidth())
                .attr('height', function (d) { return +d.y < 0 ? 0 : ((that.chart.height - that.padding.bottom) - (that.scaleY(0))) })

            this.svg.selectAll("rect")
                .transition()
                .duration(500)
                .attr("y", function (d) { return +d.y < 0 ? 0 : that.scaleY(d.y) })
                .attr("height", function (d) { return +d.y < 0 ? 0 : ((that.chart.height - that.padding.bottom) - (that.scaleY(d.y))) })
                .delay(function (d, i) { return (i * 25) })
        }

    }
}