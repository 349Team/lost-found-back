import express, { Express, Request, Response } from 'express'
import cors from 'cors'

import routes from './controllers/routes';
import { ConsoleHighlight } from './tools/console'

import Logger from './tools/logger';
import morganMiddleware from './middleware/morgan/morgan-middleware';

const app: Express = express();

// app.use(cors({origin: ['http: //localhost:3000', 'http: //localhost:3030']}));

app.use(cors())

app.use(express.json())
app.use(morganMiddleware)

express.urlencoded({ extended: true })

app.get('/', (req: Request, res: Response) => res.send('Server running version 0.2.1'))

app.use(routes)

// /* morgan config */
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
// morgan.token('param', function(req: Request, res: Response, param) {
//   return req.params[param?.toString() ?? '']
// })


app.use((req, res) => res.status(404).send('This route does not exist!'))

const PORT = process.env.PORT || 8080
console.log("BD: ", process.env.DATABASE_URL)
app.listen({port: PORT, host: "0.0.0.0"}, () => ConsoleHighlight(`[ Server running on port ${PORT} ]`))

/*
  docker stop deploy-lost-found-container && 
  docker rm deploy-lost-found-container && 
  docker rmi deploy-lost-found -f && 

  docker build --network="host" . -t deploy-lost-found
  docker run --network="host" --name deploy-lost-found-container -dp 8080:8080 deploy-lost-found


  docker stop deploy-lost-found-container && 
  docker rm deploy-lost-found-container && 
  docker run --network="host" --name deploy-lost-found-container -it -p 8080:8080 deploy-lost-found

*/