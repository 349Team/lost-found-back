import { Request, Response, Router } from 'express'
import { uploadManipulator } from '../middleware/upload/upload-manipulator';
import { HttpExceptionHandler, InternalServerErrorException, ServiceUnavailableException } from '../models/exception-http';
import { objectService } from "../services/object-service";

const objectController = Router()

/* create object */
objectController.post('/', async (req: Request, res: Response) => {
   try {
      var response = await objectService.createObject(req.body)
      res.status(201).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})

/* add images to object */
const allowedExtensions = ['png', 'jpg', 'jpeg']
objectController.post('/images/:objectId', uploadManipulator.asMiddleware('image', 'files/images', allowedExtensions), async (req: Request, res: Response) => {
   try {
      var response = await objectService.addImagesToObject(req.files as (Express.Multer.File[] | undefined), Number(req.params.objectId))
      return res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})

/* get object by id */
objectController.get('/:objectId', async (req: Request, res: Response) => {
  try {
    var response = await objectService.getObjectById(Number(req.params.objectId))
    res.status(200).json(response)
  } catch (err) { HttpExceptionHandler(res, err) }
})

/* get all objects */
objectController.get('/', async (req: Request, res: Response) => {
   try {
      var response = await objectService.findAll()
      return res.status(200).json(response)
   } catch (err) { HttpExceptionHandler }
})


/* get objects by user id */
objectController.get('/user/:userId', async (req: Request, res: Response) => {
   try {
      var response = await objectService.findObjectsByUserId(Number(req.params.userId))
      res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err) }
})


/* get objectss by tag id */
objectController.get('/tag/:tagId', async (req: Request, res: Response) => {
   try {
      var response = await objectService.findObjectsByTag(Number(req.params.tagId))
      res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err)}
})

/* delete object by id */
objectController.delete('/:objectId', async (req: Request, res: Response) => {
   try {
      var response = await objectService.deleteObjectById(Number(req.params.objectId))
      return res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err)}
})

/* search on objects (+tags) */
objectController.get('/search/:search', async (req: Request, res: Response) => {
   try {
      var response = await objectService.searchOnObjects(req.params.search)
      res.status(200).json(response)
   } catch (err) { HttpExceptionHandler(res, err)}
})

/* finish object */
objectController.post('/finish/:id', async (req: Request, res: Response) => {
   try {
      var id = Number(req.params.id)

      if(!id)  throw new InternalServerErrorException('parse id')

      await objectService.finishObject(id);
      res.sendStatus(200)
   } catch (err) { HttpExceptionHandler(res, err)}
})

export default objectController
