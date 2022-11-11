const padding = {
    left: 30,
    right: 15,
    top: 15,
    bottom: 50
}
const chart = {
    width: 850,
    height: 600
}
class TeamChart {
    constructor(data) {
        this.chartData = [...data[0]]
        console.log(data)

        this.svg = d3.selectAll("#teamChart")
            .attr("width", "100%")
            .attr("height", chart.height)


        this.categories = {
            "Scoring": ["Total Points Per Game", "Total Points", "Total Touchdowns"],
            "1st Downs": ["Total 1st Downs", "Rushing 1st Downs", "Passing 1st Downs"],
            "Passing": ["Net Passing Yards","Passing Touchdowns", "Interceptions"],
            "Rushing": ["Rushing Attempts", "Rushing Yards", "Yards Per Rush Attempt"],
            "Offense": ["Total Offensive Plays", "Total Yards"],
            "Returns": ["Avg Kickoff Return Yards", "Avg Punt Return Yards", "Avg Interception Return Yards"],
            "Kicking": ["Net Avg Punt Yards"],
            "Penalties": ["Avg Per Game YDS"]
        }

        this.scaleY = d3.scaleLinear()
            .domain([0, 45])
            .range([chart.height - padding.bottom, padding.top])

        this.scaleX = d3.scaleBand()
            .domain([2004,2005,2006,2007,2008,2009,2010,2011,2012,2013, 
                    2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022])
            .range([padding.left, chart.width - padding.right]).padding(-1)

        this.attachCategoryHandler()
        this.drawAxis()
    }

    drawAxis() {
        var y_axis = d3.axisLeft()
            .scale(this.scaleY)

        var x_axis = d3.axisBottom()
            .scale(this.scaleX)

        this.svg.selectAll('text,.tick').remove()

        this.svg.append('text')
            .attr("x", chart.width / 2)
            .attr("y", chart.height - 5)
            .text("Season")


        this.svg.append('g')
            .attr('transform', 'translate(' + padding.left + ',0)')
            .transition()
            .duration(1500)
            .call(y_axis)

        this.svg.append('g')
            .attr('transform', 'translate(0,' + (chart.height - padding.bottom) + ')')
            .transition()
            .duration(1500)
            .call(x_axis)

        this.addLegend()
    }

    addLegend() {
        let legend = this.svg.append('g')

        legend.append('text')
            .text('Ravens')
            .attr('x', chart.width + 50)
            .attr('y', chart.height / 2)

        legend.append('text')
            .text('Opponents')
            .attr('x', chart.width + 50)
            .attr('y', (chart.height / 2) + 20)

        legend.append('rect')
            .attr('x', chart.width + 30)
            .attr('y', (chart.height / 2) - 10)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', 'purple');

        legend.append('rect')
            .attr('x', chart.width + 30)
            .attr('y', (chart.height / 2) + 10)
            .attr('width', 10)
            .attr('height', 10)
            .attr('fill', 'red');


    }

    attachCategoryHandler() {
        let categoryDropDown = d3.select(".dropdown" && ".category")
        let statisticDropDown = d3.select(".dropdown" && ".statistic")
        let categoryDropDownItems = categoryDropDown.selectAll('.dropdown-item')

        let categories = this.categories

        let that = this
        categoryDropDownItems
            .on('click', function () {

                that.svg.selectAll('.chartPath').remove()


                categoryDropDown.select('.btn')
                    .text(this.text)

                let stats = categories[this.text]

                let items = statisticDropDown.select(".dropdown-menu")
                    

                items.selectAll('a').remove()

                items.selectAll('dropdown-item')
                    .data(stats)
                    .enter()
                    .append('a')
                    .text((d) => d)
                    .attr('class', 'dropdown-item')

                that.attachStatisticHandler(stats, this.text)

            })
    }

    attachStatisticHandler(stats, category) {
        let statisticDropDown = d3.select(".dropdown" && ".statistic")
        let statisticDropDownItems = statisticDropDown.selectAll('.dropdown-item')

        let that = this
        statisticDropDownItems
            .on('click', function () {
                statisticDropDown.select('.btn')
                    .text(this.text)

                that.updateChartData(this.text, category)
            })
    }

    updateChartData(selection, category) {

        selection = selection.replace(/\s/g,"")
        console.log(category)
        console.log(selection)

        if(category === "1st Downs"){
            category = "Downs"
            if(selection === "Total 1st Downs"){
                selection = "TotalDowns"
            }
            else if(selection === "Rushing 1st Downs"){
                selection = "RushingDowns"
            }
            else{
                selection = "PassingDowns"
            }
        }
        
        var ravensData = this.chartData.map(function (d) {
            //console.log(d)
            return {
                x: d.Year,
                y: d.Ravens[category][selection]
            }
            
        })

        var opponentsData = this.chartData.map(function (d) {
            return {
                x: d.Year,
                y: d.Opponents[category][selection]
            }
        })

        this.drawChart(ravensData, opponentsData)
    }

    drawChart(ravensData, opponentsData) {
        var allData = ravensData.concat(opponentsData)
        console.log(allData)
        this.scaleY
            .domain([d3.min(allData, function (d) { return d.y }), d3.max(allData, function (d) { return d.y })])

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
            .duration(1500)

        opponentsPath
            .attr("stroke-dasharray", opponentsPathLength + " " + opponentsPathLength)
            .attr("stroke-dashoffset", opponentsPathLength)
            .transition()
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0)
            .duration(1500)
    }
}