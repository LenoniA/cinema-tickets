import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('purchaseTickets', () => {
    it('Should purchase one adult ticket', () => {
        let request = {
            accountNumber: 1,
            ticketTypeRequest: [new TicketTypeRequest("ADULT", 1)]
        }

        let ticketService = new TicketService;

        expect(ticketService.purchaseTickets(request) === "OK");
    });
}); 