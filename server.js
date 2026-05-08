const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    
    // 1. se visualiza la primera vista (GET /) donde se ejecuta el archivo de index.html
    if (req.method === 'GET' && req.url === '/') {
        fs.readFile('index.html', (err, data) => {
            if (err) {
                res.writeHead(500);
                return res.end('Error cargando index.html');
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(data);
        });
    } 
    
    // 2. se procesa el envío del formulario y cargar la segunda vista (POST /mostrar)
    else if (req.method === 'POST' && req.url === '/mostrar') {
        let body = '';

        // Recibe los datos del formulario
        req.on('data', chunk => {
            body += chunk.toString();
        });

        // Una vez recibidos todos los datos
        req.on('end', () => {
            // muestra los datos del animal favorito (ej: "animal=mariposa")
            const formData = querystring.parse(body);
            const nombreAnimal = formData.animal;

            // la segunda vista muestra el nombre del animal favorito
            fs.readFile('resultado.html', 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error cargando resultado.html');
                }
                
                // muestra los resultados con el nombre del animal en el HTML
                const htmlModificado = data.replace('{{animal}}', nombreAnimal);

                // Enviar la nueva página al navegador
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(htmlModificado);
            });
        });
    } 
    
    // 3. Validaciones si la ruta es la correcta.
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Página no encontrada');
    }
});

// Levantamos el servidor en un puerto local
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});