import express from 'express'
import cors from 'cors'
import axios, { AxiosError } from 'axios'
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

const selectNode = () => {
  const selectedLuceneNode = luceneNodes[currentLuceneNodeIndex]
  currentLuceneNodeIndex = ++currentLuceneNodeIndex % luceneNodes.length
  console.log(`select: ${selectedLuceneNode}`)
  return selectedLuceneNode
}

app.get('/search', async (req, res) => {
  try {
    // select using round-robin
    const selectedLuceneNode = selectNode()
    const response = await axios.get(`${selectedLuceneNode}/search`, {
      params: {
        query: req.query.q,
        forwarding: true
      }
    })
    res.send(response.data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching search results:", errorMessage)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get('/article/:title', async (req, res) => {
  try {
    // select using round-robin
    const selectedLuceneNode = selectNode()
    const response = await axios.get(
      `${selectedLuceneNode}/document/${req.params.title}`
    )
    res.send(response.data)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error fetching article:", errorMessage)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`)
})
