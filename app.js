require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Sketch",
    "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngine",
    "esri/identity/IdentityManager"
], function(WebMap, MapView, Sketch, GraphicsLayer, geometryEngine, IdentityManager) {

    // Configuração do WebMap existente
    const webmap = new WebMap({
        portalItem: {
            id: "a4a183940a154ff7969ed40696fcefba" // Substituir pelo ID do seu WebMap
        }
    });

    const view = new MapView({
        container: "viewDiv",
        map: webmap
    });

    let sketch;
    const graphicsLayer = new GraphicsLayer();

    // Adiciona camada gráfica para as linhas
    webmap.add(graphicsLayer);

    // Configuração do Sketch
    view.when(() => {
        sketch = new Sketch({
            view: view,
            layer: graphicsLayer,
            creationMode: "single",
            availableCreateTools: ["polyline"]
        });

        sketch.on("create", (event) => {
            if (event.state === "complete") {
                const geometry = event.graphic.geometry;
                calculateLength(geometry);
            }
        });
    });

    // Função de cálculo
    function calculateLength(geometry) {
        const length = geometryEngine.geodesicLength(geometry, "meters");
        const display = `Extensão: ${length.toFixed(2)}m (${(length/1000).toFixed(3)}km)`;
        document.getElementById("lengthDisplay").textContent = display;
    }

    // Controle do botão
    document.getElementById("drawBtn").addEventListener("click", () => {
        sketch.create("polyline");
    });

    // Autenticação OAuth
    IdentityManager.registerOAuthInfos([{
        appId: "SEU_CLIENT_ID", // Registrar aplicação no Developers Dashboard
        portalUrl: "https://environpact.maps.arcgis.com/"
    }]);
});
