import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('purchaseTickets', () => {
    let request;
    let ticketService;

    beforeEach(() => {
        request = { accountNumber: 1, ticketTypeRequest: [new TicketTypeRequest("ADULT", 1)]};
        ticketService = new TicketService();
    });

    it('Should purchase one adult ticket', () => {
        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toBe(true);
    });

    it('Should purchase child ticket with adult ticket', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("CHILD", 1)];

        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toBe(true);
    });

    it('Should purchase infant ticket with adult ticket', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("INFANT", 1)];

        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toBe(true);
    });


    it('Should reject requests with no tickets requests', () => {
        request.ticketTypeRequest = [];

        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("Number of people must be greater than 0");
    });

    it('Should reject requests with sum of 0 tickets', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 0)];

        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("Number of people must be greater than 0");
    });

    it('Should reject child ticket without adult', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("CHILD", 1)];

        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("There must be an adult to accompany the child/children");
    });

    it('Should reject infant ticket without adult', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("INFANT", 1)];

        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrow("There must be an adult for every infant");
    });

    it('Should reject purchase of 21 adult tickets', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 21)];
        
        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrow("Cannot purchase more than 20 tickets");
    });
});