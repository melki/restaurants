var position = new google.maps.LatLng(32.815637, -96.789551)
var marker;
var timer;
var map;
var data = new Array();
var play = 0;


function initialize() {
    d3.csv("rest.csv", function(a) {
        
        a.forEach(function(d) {
            var b = {};
            b.name = d.name;
            d.lat = d.lat.replace(/,/g, '.');
            d.long =d.long.replace(/,/g, '.');          
            b.note = d.note;  
            
            b.lat = +d.lat;  
            b.long = +  d.long;  
            data.push(b);
        
        });
        draw(data);
    });

}


    function draw(data) {
    
    var mapOptions = {
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: position
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
     var overlay = new google.maps.OverlayView();




    // Add the container when the overlay is added to the map.
    overlay.onAdd = function() {
        var layer = d3.select(this.getPanes().overlayLayer).append("div")
            .attr("class", "stations");




        // Draw each marker as a separate SVG element.
        // We could use a single SVG, but what size would it have?

                
                var color = d3.scale.linear()
    .domain([70, 100])
    .range(["red", "green"]);


        overlay.draw = function() {
            var projection = this.getProjection(),
                padding = 100;

            var marker = layer.selectAll("svg")
                .data(d3.entries(data))
                .each(transform) // update existing markers
                .enter().append("svg:svg")
                .each(transform)
                .attr("class", "marker");

            //     // Add a circle.
            marker.append("svg:circle")
                .attr("r", 7)
                .style("opacity",0.2)
                .style("fill",function(d){ return color(d.value.note);})
                .attr("cx", padding)
                .attr("cy", padding);


            function transform(d, i) {
                    
                d = new google.maps.LatLng(+d.value.lat, +d.value.long);
                d = projection.fromLatLngToDivPixel(d);

                
                

                return d3.select(this)
                    .style("left", (d.x - padding) + "px")
                    .style("top", (d.y - padding) + "px");
            }
        };
    };
    overlay.setMap(map);
}