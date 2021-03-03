async function utahTaz() {

    // let width = 600;
    // let height = 1500;
    // // let svg = d3.select("#mapLayer").append("svg")
    // // .attr("width",width)
    // // .attr("height",height);
    
    let  projection = d3.geoConicConformal()
                  .parallels([40 + 43/60, 41 + 47/60])
                  .center([0, 41])
                  .scale(36000)
                  .rotate([111 + 30 / 60, 0]);
              

    // This converts the projected lat/lon coordinates into an SVG path string
    let path = d3.geoPath()
        .projection(projection);
     
    // Load in GeoJSON data
    let json = await d3.json("/data/utah_geo.json");
    console.log(json);
    let Busjson = await d3.json("/data/busRouteTAZ.json");
    

    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    };
    
    // Bind data and create one path per GeoJSON feature
    d3.select("#mapLayer").selectAll("path")
        .data(json.features)
        .join("path")
        .attr("d", path)
        .style('opacity', '0.5')
        .style("fill","grey")
        .attr("transform", "translate(50," +180 + ")");    
    
}   

async function utahPollution() {
    
    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    };

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let json = await d3.json("/data/utah_geo.json");
    let tazPollution = [];
    for (let i = 0; i < json.features.length; i++){ 
        tazPollution.push(json.features[i].properties.MEAN);
    }
    
    let maxPollution = d3.max(tazPollution)
    let minPollution = d3.min(tazPollution)
            
    // let PollutionScale = d3.scaleLinear()
    //   .domain([minPollution,maxPollution])
    //   .range(["#FFFFDD","#0b395a"]); 
    let PollutionScale = d3.scaleLinear().domain([minPollution,maxPollution])
    .range(["#a7cdf8", "blue"])
    
    d3.select("#mapLayer").selectAll("path")
        
        .style("fill",function(d){return PollutionScale(d.properties.MEAN)})
        .attr("transform", "translate(50," +180 + ")")         
        .on("mouseover", function(d) {	
            d3.select(this).style("fill", "#f30524")
            div.transition()		
            .duration(50)		
            .style("opacity", 1)	
            
        div.html("TAZID: "+ d.properties.TAZID + "<br/>"+"PM 2.5: " + d3.format(",.2f")(d.properties.MEAN))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 50) + "px")
                
        })					
        
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(50)		
            .style("opacity", 0)
        d3.select(this).style('fill', function(d){
                return PollutionScale(d.properties.MEAN)})	
    });

    
    var Pollutionlegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .title("Pollution")
    .scale(PollutionScale)

    d3.select("#mapLayer").append("g")
        .attr("id", "legendG")
        .attr("transform", "translate(352, 60)")
        .call(Pollutionlegend);
}   

async function utahLowIncomePop() {
    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    }
    

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let json = await d3.json("/data/utah_geo.json");
    let tazLowPop = [];
    for (let i = 0; i < json.features.length; i++){ 
        tazLowPop.push(json.features[i].properties.low_pop);
    }
    
    let maxPop = d3.max(tazLowPop)
    let minPop = d3.min(tazLowPop)
            
    let LowPopScale = d3.scaleSequential().domain([minPop,maxPop])
    .interpolator(d3.interpolatePuRd);

    

    d3.select("#mapLayer").selectAll("path")
        
        .style("fill",function(d){return LowPopScale(d.properties.low_pop)})
        .attr("transform", "translate(50," +180 + ")")         
        .on("mouseover", function(d) {	
            d3.select(this).style("fill", "#16ac09")
            div.transition()		
            .duration(50)		
            .style("opacity", 1)	
            
        div.html("TAZID: "+ d.properties.TAZID + "<br/>"+"Low-income population: " + d3.format(",.0f")(d.properties.low_pop))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 50) + "px")
                
        })					
        
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(50)		
            .style("opacity", 0)
        d3.select(this).style('fill', function(d){
                return LowPopScale(d.properties.low_pop)})	
    });

    
    var LowIncomePopLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .title("Low Income Population")
    .scale(LowPopScale)

    d3.select("#mapLayer").append("g")
        .attr("id", "legendG")
        .attr("transform", "translate(352, 60)")
        .call(LowIncomePopLegend);
} 

async function utahAverageIncome() {

    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    }

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let json = await d3.json("/data/utah_geo.json");
    let tazAvgIncome = [];
    for (let i = 0; i < json.features.length; i++){ 
        tazAvgIncome.push(json.features[i].properties.AVGINCOME);
    }
    
    let maxAvgInc = d3.max(tazAvgIncome)
    let minAvgInc = d3.min(tazAvgIncome)
    console.log(maxAvgInc,minAvgInc)
            
    // let AvgIncScale = d3.scalePow()
    //     .exponent(0.5)
    //   .domain([minAvgInc,maxAvgInc])
    //   .range(["#894df7","#18033f"]); 
    let AvgIncScale = d3.scaleSequential().domain([minAvgInc,maxAvgInc])
  .interpolator(d3.interpolateViridis);

  

    d3.select("#mapLayer").selectAll("path")
        
        .style("fill",function(d){return AvgIncScale(d.properties.AVGINCOME)})
        .attr("transform", "translate(50," +180 + ")")         
        .on("mouseover", function(d) {	
            d3.select(this).style("fill", "#16ac09")
            div.transition()		
            .duration(50)		
            .style("opacity", 1)	
            
        div.html("TAZID: "+ d.properties.TAZID + "<br/>"+"Average Income ($): " + d3.format(",.0f")(d.properties.AVGINCOME))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 50) + "px")
                
        })					
        
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(50)		
            .style("opacity", 0)
        d3.select(this).style('fill', function(d){
                return AvgIncScale(d.properties.AVGINCOME)})	
    });
    var AvgIncLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .title("Average Income ($)")
    .scale(AvgIncScale)


    d3.select("#mapLayer").append("g")
        .attr("id", "legendG")
        .attr("transform", "translate(352, 60)")
        .call(AvgIncLegend);
   
} 

async function utahHHPop() {
    
    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    }

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let json = await d3.json("/data/utah_geo.json");
    let tazHHPop = [];
    for (let i = 0; i < json.features.length; i++){ 
        tazHHPop.push(json.features[i].properties.HHPOP);
    };
    
    let maxHHPop = d3.max(tazHHPop)
    let minHHPop = d3.min(tazHHPop)
            
    let HHPopScale = d3.scaleLinear()
      .domain([minHHPop,maxHHPop])
      .range(["#f5baba","#971605"]); 


    d3.select("#mapLayer").selectAll("path")
        
        .style("fill",function(d){return HHPopScale(d.properties.HHPOP)})
        .attr("transform", "translate(50," +180 + ")")         
        .on("mouseover", function(d) {	
            d3.select(this).style("fill", "#16ac09")
            div.transition()		
            .duration(50)		
            .style("opacity", 1)	
            
        div.html("TAZID: "+ d.properties.TAZID + "<br/>"+"Household population: " + d3.format(",.0f")(d.properties.HHPOP))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 50) + "px")
                
        })					
        
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(50)		
            .style("opacity", 0)
        d3.select(this).style('fill', function(d){
                return HHPopScale(d.properties.HHPOP)})	
    });
    var HHPOPLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .title("Household Population")
    .scale(HHPopScale)

    d3.select("#mapLayer").append("g")
        .attr("id", "legendG")
        .attr("transform", "translate(352, 60)")
        .call(HHPOPLegend);
} 

async function utahemp() {
    
    if (!d3.select("#legendG").empty()) {
        d3.select("#legendG").remove();
    }

    let div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

    let json = await d3.json("/data/utah_geo.json");
    let tazHHPop = [];
    for (let i = 0; i < json.features.length; i++){ 
        tazHHPop.push(json.features[i].properties.TOTEMP);
    };
    
    let maxHHPop = d3.max(tazHHPop)
    let minHHPop = d3.min(tazHHPop)
            
    let HHPopScale = d3.scaleLinear()
      .domain([minHHPop,maxHHPop])
      .range(["#f5baba","#971605"]); 


    d3.select("#mapLayer").selectAll("path")
        
        .style("fill",function(d){return HHPopScale(d.properties.TOTEMP)})
        .attr("transform", "translate(50," +180 + ")")         
        .on("mouseover", function(d) {	
            d3.select(this).style("fill", "#16ac09")
            div.transition()		
            .duration(50)		
            .style("opacity", 1)	
            
        div.html("TAZID: "+ d.properties.TAZID + "<br/>"+"Household population: " + d3.format(",.0f")(d.properties.TOTEMP))	
            .style("left", (d3.event.pageX) + "px")		
            .style("top", (d3.event.pageY - 50) + "px")
                
        })					
        
        .on("mouseout", function(d) {		
        div.transition()		
            .duration(50)		
            .style("opacity", 0)
        d3.select(this).style('fill', function(d){
                return HHPopScale(d.properties.TOTEMP)})	
    });
    var HHPOPLegend = d3.legendColor()
    .labelFormat(d3.format(".2f"))
    .labels(d3.legendHelpers.thresholdLabels)
    .title("Household Population")
    .scale(HHPopScale)

    d3.select("#mapLayer").append("g")
        .attr("id", "legendG")
        .attr("transform", "translate(352, 60)")
        .call(HHPOPLegend);
} 





