class TeamRadarChart {

    constructor(globalApplicationState) {
       let imgLeft = document.createElement('img')
       imgLeft.src = "https://quickchart.io/chart/render/zm-bc216bd2-fa9d-4e79-b35e-5620412b5ce3?title=Season ????&data1=50,40,30,50,46,78,56,66&data2=45,67,40,56,40,60,17,53"
       
       document.getElementById('radarLeft').appendChild(imgLeft)

       let imgRight = document.createElement('img')
       imgRight.src = "https://quickchart.io/chart/render/zm-bc216bd2-fa9d-4e79-b35e-5620412b5ce3?title=Season ????&data1=50,40,30,50,46,78,56,66&data2=45,67,40,56,40,60,17,53"
       
       document.getElementById('radarRight').appendChild(imgRight)
    }
}