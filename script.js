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
            b.weight = Math.max((+d.note)-70,1);  
            b.location = new google.maps.LatLng(+d.lat, +d.long);
           
            data.push(b);
        
        });
        draw(data);
    });

}


    function draw(data) {
        
    var mapOptions = {
        zoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: position
    };

    map = new google.maps.Map(document.getElementById("map"), mapOptions);
     var overlay = new google.maps.OverlayView();

     var heatmap = new google.maps.visualization.HeatmapLayer({
  data: data,
  dissipating:true,
  radius:30,
  gradient:[
  "rgba(0,0,0,0)",
"#FF1000",
"#FF2000",
"#80FF00",
"#70FF00",
"#60FF00",
"#50FF00",
"#40FF00",
"#30FF00",
"#20FF00",
"#10FF00"]

  

});
     

heatmap.setMap(map);
    
}