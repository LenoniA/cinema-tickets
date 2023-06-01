import TicketTypeRequest from './lib/TicketTypeRequest.js';
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';
import TicketPaymentService from '../thirdparty/paymentgateway/TicketPaymentService';
import SeatReservationService from '../thirdparty/seatbooking/SeatReservationService';

export default class TicketService {
  #paymentService;
  #bookingService;

  #noOfAdults = 0;
  #noOfChildren = 0;
  #noOfInfants = 0;
  
  constructor() {
    this.#paymentService = new TicketPaymentService;
    this.#bookingService = new SeatReservationService;
  }

  #init(tickets) {
    tickets.forEach(category => {
      switch (category.getTicketType()) {
        case "ADULT":
          this.#noOfAdults += category.getNoOfTickets();
          break;
        case "CHILD":
          this.#noOfChildren += category.getNoOfTickets();
          break;
        case "INFANT":
          this.#noOfInfants += category.getNoOfTickets();
          break;  
      }
    });
  }

  #checkRange() {
    if (!(this.#noOfAdults || this.#noOfChildren || this.#noOfInfants)) {
      throw new TypeError('Number of people must be greater than 0');
    } 
    
    if ((this.#noOfAdults + this.#noOfChildren + this.#noOfInfants) > 20) {
      throw new TypeError('Cannot purchase more than 20 tickets');
    }
  }

  #checkAdults() {
    if (this.#noOfInfants && (this.#noOfInfants > this.#noOfAdults)) {
      throw new TypeError('There must be an adult for every infant');
    }

    if (this.#noOfChildren && !this.#noOfAdults) {
      throw new TypeError('There must be an adult to accompany the child/children');
    }
  }

  #calculateTotal() {
    return this.#noOfAdults * 20 + this.#noOfChildren * 10;
  }
  
  #calculateSeatNum() {
    return this.#noOfAdults + this.#noOfChildren;
  }


  purchaseTickets(accountId, ...ticketTypeRequests) {
    // throws InvalidPurchaseException
    this.#init(...ticketTypeRequests);
    let total;
    let seatNum;

    try {
      //Check the configuration of the party before calculating totals and seat allocation
      this.#checkRange();
      this.#checkAdults();

      total = this.#calculateTotal();
      seatNum = this.#calculateSeatNum();

      this.#paymentService.makePayment(accountId, total);
      this.#bookingService.reserveSeat(accountId, seatNum);
    } catch (error) {
      throw new InvalidPurchaseException(error);
    }

    return { total, seatNum };
  }
}
