
exports.apis = function (app) {
    app.get('/', function (req, res) {
        res.send("Site de Tecnologia");
    });

    app.get('/portateis', function (req, res) {
        res.send("Categoria de Portateis");
    });

    app.get('/smartphones', function (req, res) {
        res.send("Categoria de Smartphones");
    });

    app.get('/tablets', function (req, res) {
        res.send("Categoria de Tablets");
    });
}