import { Request, Response, Router } from 'express'
import { HttpExceptionHandler } from '../models/exception-http';
import { objectService } from "../services/object-service";
import { tagService } from '../services/tag-service';

const tagController = Router()


/* buscar todas as tags */
tagController.get('/', async (req: Request, res: Response) => {
  try {
    var response = await tagService.findAll()
    res.status(200).json(response)
  } catch (err) { HttpExceptionHandler(res, err) }
})


export default tagController
