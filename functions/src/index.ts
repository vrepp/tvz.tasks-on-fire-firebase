/**
 * Edoe API
 * 
 * @author Valentin Rep
 * @copyright © 2019 ViCon. All rights reserved.
 * @version 1.0
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as express from 'express'
import * as cors from 'cors'

import { authorizationMiddleware, loggerMiddleware } from './middleware'


// The Firebase Admin SDK
admin.initializeApp()

// Firestore DB
const db = admin.firestore()
db.settings({timestampsInSnapshots: true})

// Express
const app = express()

// https://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

// Parse application/json
app.use(express.urlencoded({extended: true})); 
app.use(express.json());  

// Middleware
app.use(loggerMiddleware)
app.use(authorizationMiddleware)


///////////// API v1 /////////////

// Routes
import * as usersApi from './api/users'
import * as tasksApi from './api/tasks'

// Helpers
import { UserHelper } from './helpers'
import { User } from './structs'

// Express
const api_v1 = express()

// Set Routes for /v1
api_v1.use('/users', usersApi.router)
api_v1.use('/tasks', tasksApi.router)
app.use('/v1', api_v1)

// Bind functions to /api
export const api = functions.https.onRequest(app)

// On User Create
export const onUserCreate = functions.auth.user().onCreate(async (userRecord) => {
    const userId = userRecord.uid
    const userEmail = userRecord.email || ''

    const user: User = {
        userId: userId,
        email: userEmail,
    }

    await UserHelper.createUser(userId, user)
});

