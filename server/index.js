const fs = require('fs');
const express = require('express')

app = express()

app.use(express.json())






const port = 5500
app.listen(port, () => {
    console.log('Express server running on ' + port)
})