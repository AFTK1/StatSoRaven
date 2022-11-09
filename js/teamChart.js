const padding = {
    left: 30,
    right: 15,
    top: 15,
    bottom: 20
}
const chart = {
    width: 800,
    height: 600
}
class TeamChart {
    constructor(data) {
        this.chartData = [...data[0]]
        console.log(data)

        this.svg = d3.selectAll("#teamChart")
            .attr("width", chart.width)
            .attr("height", chart.height)


        this.categories = {
            "Scoring": ["Total Points Per Game", "Total Points", "Total Touchdowns"],
            "1st Downs": ["Total 1st Downs", "Rushing 1st Downs", "Passing 1st Downs"],
            "Passing": ["Net Passing Yards", "Yards per Pass Attempt", "Passing Touchdowns", "Interceptions"],
            "Rushing": ["Rushing Attempts", "Rushing Yards", "Rushing Touchdowns"],
            "Offense": ["Total Offensive Plays", "Total Yards", "Yards Per Game"],
            "Returns": ["Total Kickoffs", "Total Punts", "Total Interceptions"],
            "Kicking": ["Net Average Punt Yards"],
            "Penalties": ["Total Yards", "Avg Per Game(YDS)"]
        }

        this.scaleY = d3.scaleLinear()
            .domain([0, 45])
            .range([chart.height - padding.bottom, padding.top])

        this.scaleX = d3.scaleBand()
            .domain([2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022])
            .range([padding.left, chart.width - padding.right])

        this.attachCategoryHandler()
        this.drawAxis()
    }

    drawAxis() {
        var y_axis = d3.axisLeft()
            .scale(this.scaleY)

        var x_axis = d3.axisBottom()
            .scale(this.scaleX)

        this.svg.selectAll('g').remove()

        this.svg.append('g')
            .attr('transform', 'translate(' + padding.left + ',0)')
            .transition()
            .duration(800)
            .call(y_axis)

        this.svg.append('g')
            .attr('transform', 'translate(0,' + (chart.height - padding.bottom) + ')')
            .transition()
            .duration(800)
            .call(x_axis)
    }

    attachCategoryHandler() {
        let categoryDropDown = d3.select(".dropdown" && ".category")
        let statisticDropDown = d3.select(".dropdown" && ".statistic")
        let categoryDropDownItems = categoryDropDown.selectAll('.dropdown-item')

        let categories = this.categories

        let that = this
        categoryDropDownItems
            .on('click', function () {
                categoryDropDown.select('.btn')
                    .text(this.text)

                let stats = categories[this.text]

                let items = statisticDropDown.select(".dropdown-menu")
                    .selectAll('.dropdown-item')

                items.remove()

                items
                    .data(stats)
                    .enter()
                    .append('a')
                    .text((d) => d)
                    .attr('class', 'dropdown-item')

                that.attachStatisticHandler(stats)
            })
    }

    attachStatisticHandler(stats) {
        let statisticDropDown = d3.select(".dropdown" && ".statistic")
        let statisticDropDownItems = statisticDropDown.selectAll('.dropdown-item')

        let that = this
        statisticDropDownItems
            .on('click', function () {
                statisticDropDown.select('.btn')
                    .text(this.text)

                that.updateChartData(this.text)
            })
    }

    updateChartData(selection) {
        console.log(selection)
        var ravensData = this.chartData.map(function (d) {
            return {
                x: d.season,
                y: d.ravens.scoring[selection]
            }
        })

        var opponentsData = this.chartData.map(function (d) {
            return {
                x: d.season,
                y: d.opponents.scoring[selection]
            }
        })

        this.drawChart(ravensData, opponentsData)
    }

    drawChart(ravensData, opponentsData) {
        var allData = ravensData.concat(opponentsData)
        console.log(allData)
        this.scaleY
            .domain([d3.min(allData,function(d){return d.y}),d3.max(allData,function(d){return d.y})])

        this.drawAxis()
        this.svg.selectAll('.chartPath').remove()

        var ravensPath = this.svg.append('path')
            .datum(ravensData)
            .attr("fill", "none")
            .attr("stroke", "purple")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x((d) => { return this.scaleX(d.x) })
                .y((d) => { return this.scaleY(d.y) })
            )
            .attr('class', 'chartPath')

        var opponentsPath = this.svg.append('path')
            .datum(opponentsData)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 5)
            .attr("d", d3.line()
                .x((d) => { return this.scaleX(d.x) })
                .y((d) => { return this.scaleY(d.y) })
            )
            .attr('class', 'chartPath')

        const ravensPathLength = ravensPath.node().getTotalLength()
        const opponentsPathLength = opponentsPath.node().getTotalLength()

        ravensPath
            .attr("stroke-dasharray", ravensPathLength + " " + ravensPathLength)
            .attr("stroke-dashoffset", ravensPathLength)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(2500)

        opponentsPath
            .attr("stroke-dasharray", opponentsPathLength + " " + opponentsPathLength)
            .attr("stroke-dashoffset", opponentsPathLength)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(2500)
    }
}