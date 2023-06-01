import TicketService from '../src/pairtest/TicketService';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest';

describe('purchaseTickets', () => {
    let request;
    let ticketService;

    beforeEach(() => {
        // Reset to a state that passes and initialise ticketService
        request = { accountNumber: 1, ticketTypeRequest: [new TicketTypeRequest("ADULT", 1)]};
        ticketService = new TicketService();
    });

    it('Should purchase one adult ticket', () => {
        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toEqual({total: 20, seatNum: 1});
    });

    it('Should purchase child ticket with adult ticket', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("CHILD", 1)];

        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toEqual({total: 30, seatNum: 2});
    });

    it('Should purchase infant ticket with adult ticket', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("INFANT", 1)];

        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toEqual({total: 20, seatNum: 1});
    });

    it('Should purchase tickets with multiple adult ticket type requests', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("INFANT", 1), new TicketTypeRequest("ADULT", 1)];

        expect(ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest)).toEqual({total: 40, seatNum: 2});
    });


    // Rejection tests
    it('Should reject requests with invalid account id', () => {
        request.accountNumber = 0.444;
        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("accountId must be an integer");
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
        }).toThrowError("There must be an adult for every infant");
    });

    it('Should reject requests with more infants than adults', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 1), new TicketTypeRequest("INFANT", 2)];
        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("There must be an adult for every infant");
    });

    it('Should reject purchase of over 20 adult tickets', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 21)];
        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("Cannot purchase more than 20 tickets");
    });

    it('Should reject purchase of over 20 tickets of different types', () => {
        request.ticketTypeRequest = [new TicketTypeRequest("ADULT", 10), new TicketTypeRequest("CHILD", 10), new TicketTypeRequest("INFANT", 5)];
        expect(() => {
            ticketService.purchaseTickets(request.accountNumber, request.ticketTypeRequest);
        }).toThrowError("Cannot purchase more than 20 tickets");
    });
});