import { messageService } from './../services/message-service';
import { Request, Response, Router } from 'express'
import { HttpExceptionHandler, ServiceUnavailableException, UnauthorizedException } from '../models/exception-http'

const messageController = Router()

// Cria mensagem
messageController.post('/send', async (req: Request, res: Response) => {
    try {
        var response = await messageService.createMessage(req.body)
        console.log(response);
        
        res.status(200).json(response)
    }catch (err) { HttpExceptionHandler(res, err) }
})

// Lista mensagens do usuário A e B
messageController.get('/list/:objectId/:requesterId', async (req: Request, res: Response) => {
    try {
        var response = await messageService.findMessages(Number(req.params.objectId), Number(req.params.requesterId))
        res.status(200).json(response)
    }catch (err) { HttpExceptionHandler(res, err) }
})

messageController.get('/info/:objectId', async (req: Request, res: Response) => {
    try {
        var response = await messageService.getInfo(Number(req.params.objectId))
        res.status(200).json(response)
    }catch (err) { HttpExceptionHandler(res, err) }
})

export default messageController