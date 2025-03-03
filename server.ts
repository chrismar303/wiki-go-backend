import express from 'express'
import cors from 'cors'
import axios from 'axios'
import 'dotenv/config'

const app = express()
const PORT: number | string = process.env.PORT || 3000
app.use(cors()) // enable frontend access

const luceneNodes: string[] = [
  `${process.env.LUCENE_ENDPOINT_1}`,
  `${process.env.LUCENE_ENDPOINT_2}`,
  `${process.env.LUCENE_ENDPOINT_3}`,
  `${process.env.LUCENE_ENDPOINT_4}`
]

/*** Forward request to lucene compute nodes ***/
let currentLuceneNodeIndex = 0
app.get('/search', async (req, res) => {
  // select using round-robin
  const selectedLuceneNode = luceneNodes[currentLuceneNodeIndex]
  currentLuceneNodeIndex = ++currentLuceneNodeIndex % luceneNodes.length
  console.log(`select: ${selectedLuceneNode}`)

  const response = await axios.get(`${selectedLuceneNode}/search`, {
    params: {
      query: req.query.q,
      forwarding: true
    }
  })
  res.send(response.data)
})

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})
