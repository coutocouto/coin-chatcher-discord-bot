
const express = require('express');
const path = require('path');
const Main = require('./main')

class Server {

    constructor() {

        this.app = express();
        this.router = express.Router();
        this.port = process.env.PORT || 8080

    }

    start () {

	

        this.router.get('/', (req, res) => {
	
	    new Main().run()	
	    res.send("Bot Online!")
            

        })

        this.app.use('/', this.router);
        this.app.listen(this.port, () => {

            console.log(`Servidor ouvindo na porta ${this.port}`)

        })

    }
}

module.exports = Server