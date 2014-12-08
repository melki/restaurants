var position = new google.maps.LatLng(32.815637, -96.789551)
var marker;
var timer;
var map;
var data = new Array();
var play = 0;
var note = 50;
var previousOverlay = 0;
var animation = 1;
var overlay = new Array();
var marker = new Array();

function initialize() {
    d3.csv("rest.csv", function(a) {

        for (var i = 0; i < 103; i++) {
            data[i] = new Array();
        };

        a.forEach(function(d) {
            var b = {};
            b.name = d.name;
            d.lat = d.lat.replace(/,/g, '.');
            d.long = d.long.replace(/,/g, '.');
            b.note = +d.note;

            b.lat = +d.lat;
            b.long = +d.long;
            data[b.note].push(b);


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
    var color = d3.scale.linear()
        .domain([70, 100])
        .range(["red", "green"]);

    function addOverlay(numOverlay,change) {
        if(animation==1){addOnePoint();}

        overlay[numOverlay] = new google.maps.OverlayView();




        // Add the container when the overlay is added to the map.
        overlay[numOverlay].onAdd = function() {
            var layer = d3.select(this.getPanes().overlayLayer).append("div")
                .attr("class", "stations");




            // Draw each marker as a separate SVG element.
            // We could use a single SVG, but what size would it have?




            overlay[numOverlay].draw = function() {
                var projection = this.getProjection(),
                    padding = 100;

                 marker[numOverlay] = layer.selectAll("svg")
                    .data(d3.entries(data[numOverlay]))
                    .each(transform) // update existing markers
                    .enter().append("svg:svg")
                    .each(transform)
                    .attr("class", "marker");

                //     // Add a circle.
                
                   if(animation==1)
                   {
                    marker[numOverlay].append("svg:circle")
                    .attr("r", 0)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .style("fill", function(d) {
                        return color(d.value.note);
                    })
                    .transition()
                    .attr("r", 10)
                    .duration(1000).style("opacity", 0).remove();
                   }
                   if(animation==0 && change==0)
                   {
                    
                    if(previousOverlay!=0)
                        {
                            for (var i = 0; i < marker[previousOverlay].length; i++) {
                                marker[previousOverlay].remove();
                            };
                            
                        }
                            previousOverlay = numOverlay;
                        
                      marker[numOverlay].append("svg:circle")
                    .attr("r", 5)
                    .attr("cx", padding)
                    .attr("cy", padding)
                    .style("fill", function(d) {
                        return color(d.value.note);
                    });
                    
                   } 

                function findDelay(note) {
                    return (note - 60) * 2000;
                }



                function transform(d, i) {

                    d = new google.maps.LatLng(+d.value.lat, +d.value.long);
                    d = projection.fromLatLngToDivPixel(d);




                    return d3.select(this)
                        .style("left", (d.x - padding) + "px")
                        .style("top", (d.y - padding) + "px");
                }
            };
        };
        
        overlay[numOverlay].setMap(map);
    }

    function addOnePoint(){
        note++;
        
        
        $("#infoNote").text(note+"/100");

    }
    $("#choseNote").change(function(){
        
        animation = 0;
        note = $("#range").val()
        addOverlay($("#range").val(),0);
        $("#infoNote").text(note+"/100");
        
        

    });
    for (var i = 1; i <= 50; i++) {
        setTimeout(addOverlay, i * 800, i + 50,1);
        

    };

}