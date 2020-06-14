/**
 * Tasks Router
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import * as express from 'express'

import { TaskHelper } from '../../helpers'

export let router = express.Router()

/**
 * @api {get} /tasks Retrieve User Tasks 
 * @apiVersion 0.2.0
 * @apiName TasksGet
 * @apiGroup Tasks
 * 
 * @apiUse AuthHeader
 * 
 * @apiSuccess {Object[]} tasks List of User tasks
 * @apiSuccess {String} tasks.id Task ID
 * @apiSuccess {String} tasks.title Title
 * @apiSuccess {String} tasks.description Description
 * @apiSuccess {Date} tasks.createdTs Date of cration
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "tasks": [
 *          {
 *              "id": "a7bc0922281e015c0e1faac26717f2d3",
 *              "title": "Task title",
 *              "description": "Something to do",
 *              "createdTs": 1555292849461
 *          }
 *      ]
 *  }
 *
 * @apiUse UnauthorizedError
 * @apiUse ForbiddenError
 * @apiUse ValidationError
 */
router.get('/', async (request, response) => {
    const userId = request.body.user.uid

    try {
        const userTasks = await TaskHelper.getUserTasks(userId)

        console.log("[get] /tasks: ", userTasks)
        return response
            .status(200)
            .type('application/json')
            .send({tasks: userTasks})
    } catch (error) {
        console.error("[get] /tasks: ", error)
        return response
            .status(422)
            .type('application/json')
            .send({error: error})
    }
})

/**
 * @api {post} /tasks Create a task
 * @apiVersion 0.2.0
 * @apiName ChatsPost
 * @apiGroup Chats
 * 
 * @apiUse AuthHeader
 * 
 * @apiParam {String} title Task display name
 * @apiParam {String} description Task description
 * 
 * @apiSuccess {String} chatId Chat ID
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "chatId": "a7bc0922281e015c0e1faac26717f2d3"
 *  }
 *
 * @apiUse UnauthorizedError
 * @apiUse ForbiddenError
 * @apiUse ValidationError
 * @apiUse InternalServerError
 */
router.post('/', async (request, response) => {
    const userId = request.body.user.uid
    const { title, description } = request.body

    try {
        const task = await TaskHelper.createUserTask(userId, title, description)

        console.log("[post] /tasks: ", task.taskId)
        return response
            .status(200)
            .type('application/json')
            .send({task: task, message: "OK"});
    } catch (error) {
        console.error("[post] /tasks: ", error)
        return response
            .status(500)
            .type('application/json')
            .send({error: error});
    }
})

/**
 * @api {put} /tasks Update a task
 * @apiVersion 0.2.0
 * @apiName TasksPut
 * @apiGroup Tasks
 * 
 * @apiUse AuthHeader
 * 
 * @apiParam {String} title Task display name
 * @apiParam {String} description Task description
 * 
 * @apiSuccess {String} taskId Task ID
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "chatId": "a7bc0922281e015c0e1faac26717f2d3"
 *  }
 *
 * @apiUse UnauthorizedError
 * @apiUse ForbiddenError
 * @apiUse ValidationError
 * @apiUse InternalServerError
 */
router.put('/:taskId', async (request, response) => {
    const userId = request.body.user.uid
    const { taskId } = request.params
    const { title, description } = request.body

    try {
        const task = await TaskHelper.updateUserTask(userId, taskId, title, description)

        console.log("[post] /tasks: ", taskId)
        return response
            .status(200)
            .type('application/json')
            .send({task: task, message: "OK"});
    } catch (error) {
        console.error("[post] /tasks: ", error)
        return response
            .status(500)
            .type('application/json')
            .send({error: error});
    }
})

/**
 * @api {delete} /tasks/:taskId Delete a task
 * @apiVersion 0.2.0
 * @apiName TasksDelete
 * @apiGroup Tasks
 * 
 * @apiUse AuthHeader
 * 
 * @apiParam {String} taskId Task ID
 * 
 * @apiSuccess {String} taskId Task ID of Deleted task
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "taskId": "a7bc0922281e015c0e1faac26717f2d3"
 *  }
 *
 * @apiUse UnauthorizedError
 * @apiUse ForbiddenError
 * @apiUse ValidationError
 * @apiUse InternalServerError
 */
router.delete('/:taskId', async (request, response) => {
    const userId = request.body.user.uid
    const { taskId } = request.params

    try {
        await TaskHelper.deleteUserTask(userId, taskId)
        
        console.log("[delete] /tasks: ", taskId)
        return response
            .status(200)
            .type('application/json')
            .send({taskId: taskId, message: "OK"})
    } catch (error) {
        console.error("[delete] /tasks: ", error)
        return response
            .status(500)
            .type('application/json')
            .send({error: error});
    }    
})


/**
 * Return error 404 if Route is not found
 */
router.all("*", async (request, response) => {
    response
        .status(404)
        .send("404: Route not found")
})
