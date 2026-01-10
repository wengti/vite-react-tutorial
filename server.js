import express from 'express'
import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')))

app.get('/api/message', returnMsg)
function returnMsg(req, res){
    try{
        return res.json({message: 'You receive a message from the backend.'})
    }
    catch(err){
        console.log(err)
        return res.json({message: 'Backend server-side error'})
    }
}

// Catch the route that did not get resolved from above
app.use((req, res) => {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const PORT = 8000
app.listen(PORT, ()=> console.log(`The server is connected at ${PORT}`))