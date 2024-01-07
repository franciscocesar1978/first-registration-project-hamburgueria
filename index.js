
const express = require('express')
const uuid = require('uuid')
const port = 3000
const app = express()
app.use(express.json())



const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(newOrder => newOrder.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.orderIndex = index
    request.orderId = id

    next()
}


const requestMethod = (request, response, next) => {
    const method = request.method
    const url = request.url
    console.log(` 👉 Method: ${method} 👉 URL => ${url}`)

    next()
}
app.use(requestMethod )


app.get('/orders', (request, response) => {
    return response.json(orders)

})


app.post('/orders', requestMethod, (request, response) => {
    const status = "Em preparação"
    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status }
    orders.push(newOrder)

    return response.status(201).json(newOrder)

})

app.put('/orders/:id', checkOrderId, (request, response) => {
    const { order, clientName, price } = request.body
    const status = "Em preparação"
    const index = request.orderIndex
    const id = request.orderId
  
    const updateOrder = { id, order, clientName, price, status}

    orders[index] = updateOrder

    return response.json(updateOrder)

})

app.delete('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()

})

app.get('/orders/:id', checkOrderId, (request, response) => {
    const index = request.orderIndex

    const idSpecific = orders[index]

    

    return response.json(idSpecific)
   

})

app.patch('/orders/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex
    const id = request.orderId
    const status = "Pronto"

    const statuSpecific = orders[index]

    statuSpecific.status = status

    return response.json(statuSpecific)
  


})





app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
})
