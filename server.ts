import express from 'express'
import axios from 'axios'
import 'dotenv/config'

const app = express()
const PORT: number | string = process.env.PORT || 3000

const luceneNodes: string[] = [
  `${process.env.LUCENE_ENDPOINT_1}`,
  `${process.env.LUCENE_ENDPOINT_2}`,
  `${process.env.LUCENE_ENDPOINT_3}`
]

/*** Creates 3 Test Servers ***/
// TODO: DELETE once nodes above are connected
luceneNodes.map((node, index) => {
  const nodeApp = express()
  nodeApp.get('/search', (req, res) => {
    res.send(`${node}: | ${req.query.q}\n`)
  })
  nodeApp.listen(index + 3001, () => {
    console.log(`listeing at ${node}`)
  })
})

/*** Forward request to compute nodes ***/
app.get('/search', async (req, res) => {
  // send request at lucene compute node
  const promises = luceneNodes.map(node =>
    axios.get(`${node}/search`, {params: {q: req.query.q}})
  )
  const results = await Promise.all(promises)
  res.send(`${results.map(r => r.data)}`)
})

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})
