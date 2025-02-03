require([
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/Sketch",
    "esri/geometry/geometryEngine",
    "esri/Graphic"
], function(Map, MapView, Sketch, geometryEngine, Graphic) {

    // Configuração inicial do mapa
    const map = new Map({
        basemap: "topo-vector"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        center: [-47.8825, -15.7942], // Coordenadas de Brasília
        zoom: 12
    });

    let sketch;

    // Inicializa a ferramenta de desenho
    view.when(() => {
        sketch = new Sketch({
            view: view,
            layer: new Graphic({
                symbol: {
                    type: "simple-line",
                    color: [226, 119, 40, 0.8],
                    width: 4,
                    style: "solid"
                }
            }),
            creationMode: "single"
        });

        view.ui.add(sketch, "top-right");

        // Evento de criação da linha
        sketch.on("create", (event) => {
            if(event.state === "complete") {
                const geometry = event.graphic.geometry;
                
                // Captura primeira coordenada
                const startPoint = geometry.paths[0][0];
                const longitude = startPoint[0].toFixed(5);
                const latitude = startPoint[1].toFixed(5);
                
                // Calcula extensão
                const meters = geometryEngine.geodesicLength(geometry, "meters");
                const kilometers = (meters / 1000).toFixed(3);
                
                // Atualiza display
                document.getElementById("coordinates").textContent = `${longitude}, ${latitude}`;
                document.getElementById("length").textContent = 
                    `${meters.toFixed(2)} metros | ${kilometers} km`;
            }
        });
    });

    // Geolocalização automática
    view.when(() => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    view.center = [position.coords.longitude, position.coords.latitude];
                    view.zoom = 14;
                },
                (error) => {
                    console.log("Geolocalização não permitida: ", error);
                }
            );
        }
    });
});
