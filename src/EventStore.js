import Rest from "./Rest.js";
import { decodeToken } from './jwt.js';

export default class EventStore extends Rest {

    constructor() {
        super();
        this._url = `${this._baseUrl}/events`;
    }

    async find(id) {
        return await this._getJsonData(`${this._url}/${id}`, false);
    }

    async all() {
        return await this._getJsonData(this._url, false);
    }

    async byDate(data) {
        return await this._getJsonData(`${this._url}?data=${data}`, false);
    }

    async createBooking(id, data) {
        return await this._postJsonData(`${this._url}/${id}/bookings`, data, false);
    }
    
    async findBookings(eventId) {
        return await this._getJsonData(`${this._url}/${eventId}/bookings`, true);
    }

    async findBooking(eventId, id) {
        return await this._getJsonData(`${this._url}/${eventId}/bookings/${id}`, false);
    }

    async confirmBooking(eventId, id) {
        return await this._putJsonData(`${this._url}/${eventId}/bookings/${id}/confirm`, {}, false);
    }

    async deleteBooking(eventId, id) {
        return await this._deleteJsonData(`${this._url}/${eventId}/bookings/${id}`, false);
    }

    async deleteBookings(eventId) {
        return await this._deleteJsonData(`${this._url}/${eventId}/bookings`, true);
    }
}