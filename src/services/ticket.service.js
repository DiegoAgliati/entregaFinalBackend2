import { Ticket } from '../dao/models/ticket.model.js';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
    static async createTicket(ticketData) {
        return await Ticket.create({
            code: uuidv4(),
            ...ticketData
        });
    }

    static async getTicketById(ticketId) {
        return await Ticket.findById(ticketId);
    }
}