import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import makePayment from '../thirdparty/paymentgateway/TicketPaymentService';
import reserveSeat from '../thirdparty/seatbooking/SeatReservationService'

export default class TicketService {
  /**
   * Should only have private methods other than the one below.
   */

  _calculateTotal(tickets) {
    return tickets.reduce((acc, person) => {
      return acc + (person.getTicketType() === "ADULT" ? 20 : (person.getTicketType() === "CHILD" ? 10 : 0));
    }, 0);
  }

  _calculateSeatNum(tickets) {
    return tickets.filter((person) => {
      return person.getTicketType() === "ADULT" || person.getTicketType() === "CHILD";
    }).length;
  }

  _makePayment(accountId, totalAmountToPay) {
    makePayment(accountId, totalAmountToPay);
  }

  _bookSeats(accountId, totalSeatsToAllocate) {
    reserveSeat(accountId, totalSeatsToAllocate);
  }

  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    console.log(this._calculateTotal(...ticketTypeRequests));
    console.log(this._calculateSeatNum(...ticketTypeRequests));

    return "OK";
  }
}
