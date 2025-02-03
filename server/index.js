import express from 'express';

const app = express();
const port = 3000;

app.get("/", function(req, res) {
    return res.send("Hellooo World");
});

app.listen(port, function(){
    console.log(
`
Server started
port: ${port}

Routes:

`

    );
});
