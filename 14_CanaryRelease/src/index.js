const express = require("express")
const app     = express()

const PORT    = process.env.PORT || 3000
const RELEASE = process.env.RELEASE || "1.0"

app.get("/", (req, rsp) => {
  rsp.send(`Release ${RELEASE}`).status(200)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
