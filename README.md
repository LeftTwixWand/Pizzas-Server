# Pizzas Server
- Pizzas Server is a backend REST API for Pizzas Shop.
- API is built on Express and includes classic GET, POST, PUT, DELETE endpoints.
- MongoDB is used as database.
- API and database are deployed to Microsoft Azure cloud via GitHub actions.

## API Reference

#### Get all pizzas
```http
  GET https://pizzas-backend.azurewebsites.net/pizzas)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pizzas` | `array` | Includes all pizzas |

#### Get one pizza by Id
```http
  GET https://pizzas-backend.azurewebsites.net/pizzas/pizzaId)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pizzaId` | `string` | pizza id |
| `pizzas` | `array` | Includes all pizzas |


#### Delete pizza by Id
```http
  DELETE https://pizzas-backend.azurewebsites.net/pizzas/pizzaId)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pizzaId` | `string` | pizza id |
| `pizzas` | `array` | Includes all pizzas |


#### Add new pizza
```http
  POST https://pizzas-backend.azurewebsites.net/pizzas/)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pizzas` | `array` | Includes all pizzas |


#### Updated pizza
```http
  PUT https://pizzas-backend.azurewebsites.net/pizzas/pizzaId)
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pizzaId` | `string` | pizza id |
| `pizzas` | `array` | Includes all pizzas |
