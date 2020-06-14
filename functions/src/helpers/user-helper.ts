/**
 * Users Helper
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import * as admin from 'firebase-admin'
import { User } from '../structs'

const usersCollection = 'users'
const usersRef = admin.database().ref().child(usersCollection)

export class UserHelper {
    /**
     * Fetch Users
     */
    static async getUsers() {
        const users = new Array<User>()

        try {
            const snap = await usersRef.once('value')
            snap.forEach((childSnap) => {
                users.push(childSnap.val() as User)
                return false
            })
        } catch (error) { 
            throw error
        }

        return users
    }

    /**
     * Get User for userId
     */
    static async getUserByUserId(userId: string) {
        let user: User

        try {
            const snap = await usersRef.child(userId).once('value')
            user = snap.val() as User
        } catch (error) {
            console.error('Error fetching userByUserId: %s', userId)
            throw error
        }

        return user
    }

    /**
     * Create User
     * 
     * @param userId User ID
     * @param user  User Object
     */
    static async createUser(userId: string, user: User) {
        try {
            await usersRef.child(userId).set(user)
            console.log('Create User: %s [%s]', user.userId, user.email)
        } catch (error) {
            console.error('Create User: %s [%s]', user.userId, user.email)
            throw error
        }
    }
}