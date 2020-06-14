/**
 * Tasks Helper
 * 
 * @author Valentin Rep
 * @copyright © 2020. All rights reserved.
 * @version 1.0
 */

import * as admin from 'firebase-admin'
import { Task } from '../structs'

const userTasksCollection = 'tasks'
const userTasksOrderKey = 'taskId'
const userTasksRef = admin.database().ref().child(userTasksCollection)

export class TaskHelper {
    /**
     * Fetch Tasks for particular User
     * 
     * @param userId User ID
     */
    static async getUserTasks(userId: string) {
        const tasks = new Array<Task>()

        try {
            const snap = await userTasksRef.child(userId).orderByChild(userTasksOrderKey).once('value')
            snap.forEach((childSnap) => {
                tasks.push(childSnap.val() as Task)
                return false
            })
        } catch (error) { 
            throw error
        }

        return tasks
    }

    /**
     * Create User Task
     */
    static async createUserTask(userId: string, title: string, description: string) {
        const task: Task = {
            taskId: '',
            title: title,
            description: description
        }

        try {
            const newTaskRef = await userTasksRef.child(userId).push()
            const taskId = newTaskRef.key || ''
            task.taskId = taskId

            console.log('Creating User Task: %s [%s]', taskId, userId)
            await userTasksRef.child(userId).child(taskId).set(task)
        } catch (error) {
            console.error('Creating User Task: ', error)
            throw error
        }

        return task
    }

    /**
     * Update User Task
     */
    static async updateUserTask(userId: string, taskId: string, title: string, description: string) {
        const task: Task = {
            taskId: taskId,
            title: title,
            description: description
        }

        try {
            await userTasksRef.child(userId).child(taskId).update(task)
            console.log('Updating User Task: %s', taskId)
        } catch (error) {
            console.error('Updating User Task: ', error)
            throw error
        }

        return task
    }

    /**
     * Deleting User Task
     * 
     */
    static async deleteUserTask(userId: string, taskId: string) {
        try {    
            await userTasksRef.child(userId).child(taskId).remove()
            console.log('Deleting User Task: %s [%s]', taskId, userId)
        } catch (error) {
            console.error('Deleting User Task: ', error)
            throw error
        }
    }
}