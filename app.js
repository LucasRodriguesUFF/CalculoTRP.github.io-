require([
    "esri/WebMap",
    "esri/views/MapView",
    "esri/widgets/Sketch",
    "esri/layers/GraphicsLayer",
    "esri/geometry/geometryEngine",
    "esri/identity/IdentityManager"
], function(WebMap, MapView, Sketch, GraphicsLayer, geometryEngine, IdentityManager) {

    // 1. Configurar WebMap existente (substitua o ID)
    const webmap = new WebMap({
        portalItem: {
            id: "a4a183940a154ff7969ed40696fcefba"
        }
    });

    // 2. Configurar a view do mapa
    const view = new MapView({
        container: "viewDiv",
        map: webmap
    });

    let sketch;
    const graphicsLayer = new GraphicsLayer();

    // 3. Autenticação automática via portal do ArcGIS
    IdentityManager.getCredential(webmap.portalItem.portal.url)
        .then(() => initializeApp())
        .catch(error => console.error("Erro de autenticação:", error));

    function initializeApp() {
        // 4. Adicionar camada gráfica temporária
        webmap.add(graphicsLayer);

        // 5. Configurar ferramenta de desenho
        sketch = new Sketch({
            view: view,
            layer: graphicsLayer,
            creationMode: "single",
            availableCreateTools: ["polyline"]
        });

        // 6. Evento de criação da linha
        sketch.on("create", (event) => {
            if (event.state === "complete") {
                const geometry = event.graphic.geometry;
                const length = geometryEngine.geodesicLength(geometry, "meters");
                updateLengthDisplay(length);
            }
        });

        // 7. Ativar interface do usuário
        document.getElementById("drawBtn").addEventListener("click", () => {
            sketch.create("polyline");
        });
    }

    function updateLengthDisplay(length) {
        const display = `Extensão: ${length.toFixed(2)}m (${(length/1000).toFixed(3)}km)`;
        document.getElementById("lengthDisplay").textContent = display;
    }
});
