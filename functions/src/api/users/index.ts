/**
 * Users Router
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import * as express from 'express'

import { UserHelper } from '../../helpers'

export let router = express.Router()

/**
 * @api {get} /users/info Check login info (test only) 
 * @apiVersion 0.2.0
 * @apiName UsersCheckLogged
 * @apiGroup Users
 * 
 * @apiUse AuthHeader
 * 
 * @apiSuccess {String} email Email
 * @apiSuccess {String} userId User ID
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "email": "valentin.rep@mail.com",
 *      "userId": "U5ae3M6jwyV8Q7jno936hOR72D42",
 *  }
 *
 * @apiUse UnauthorizedError
 * @apiUse ForbiddenError
 * @apiUse ValidationError
 */
router.get('/info', async (request, response) => {
    const userId = request.body.user.uid

    try {
        const user = await UserHelper.getUserByUserId(userId)
        response
            .status(200)
            .type('application/json')
            .send(user)
    } catch (error) {
        response
            .status(500)
            .type('application/json')
            .send({error: error})
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