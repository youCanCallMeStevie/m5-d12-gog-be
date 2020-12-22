const express = require("express")
const path = require("path")
const fs = require("fs-extra")

const router = express.Router()

const cartFilePath = path.join(__dirname, "cart.json")
const gamesFilePath = path.join(__dirname, "..", "games", "games.json") 

const readFile = async (path) => {
    const buffer = await fs.readFile(path)
    const text = buffer.toString()
    return JSON.parse(text)
}

const writeFile = async (content) => await fs.writeFile(cartFilePath, JSON.stringify(content)) 

// RETRIEVE
router.get("/", async(req,res, next) =>{
    res.send(await readFile(cartFilePath))
})

// ADD
router.post("/:id", async(req,res,next) =>{
    try{
        // search for the game into the games.json
        const gamesList = await readFile(gamesFilePath)
        const game = gamesList.find(g => g.id === req.params.id)
        if (!game){ // if !found => 404
            const error = new Error("Cannot find game " + req.params.id)
            error.httpStatusCode = 404
            next(error)
        }
        // if found => add it to cart.json
        const currentCart = await readFile(cartFilePath)
        const gameAlreadyInCart = currentCart.find(g => g.id === req.params.id)
        if (gameAlreadyInCart){
            const error = new Error("Game already in the cart!")
            error.httpStatusCode = 400
            next(error)
        }

        await writeFile([...currentCart, game])

        res.status(201).send()
    }
    catch(e){
        console.log(e)
        next(e)
    }
})

// REMOVE
router.delete("/:id", async(req, res,next)=>{
    // get all the elements from the cart
    const currentCart = await readFile(cartFilePath)
    // leave the specified game OUT
    const remainingElements = currentCart.filter(game => game.id !== req.params.id)
    // if the element is not there => 404
    if (remainingElements.length === currentCart.length){ // if !found => 404
        const error = new Error("Cannot find game " + req.params.id)
        error.httpStatusCode = 404
        next(error)
    }
    // write it back
    await writeFile(remainingElements)
    res.send(200)
})



module.exports = router