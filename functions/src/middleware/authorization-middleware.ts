/**
 * Authorization Middleware
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import * as admin from 'firebase-admin'
import { Request, Response, NextFunction } from 'express'

export const authorizationMiddleware = async (request: Request, response: Response, next: NextFunction) => {
    // There is no Authorization header
    if ( !request.headers.authorization || !request.headers.authorization.startsWith('Bearer') ) {
        console.error('Authorize your request by providing HTTP header:', 'Authorization: Bearer <Firebase ID Token>')
        response
            .status(403)
            .type('application/json')
            .send({error: 'Forbidden'})
        
        return
    }

    const idToken = request.headers.authorization.split('Bearer ')[1]

    admin.auth()
        .verifyIdToken(idToken)
        .then(decodedIdToken => {
            console.log('Decoded Firebase ID token', decodedIdToken);
            request.body.user = decodedIdToken;
            next();
        })
        .catch(error => {
            console.error('Error while verifying Firebase ID token:', error);
            response
                .status(401)
                .type('application/json')
                .send({error: 'Unauthenticated'});
        })
}