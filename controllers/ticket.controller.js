const { USERTYPES, USER_STATUS } = require("../constant");
const Ticket = require("../models/ticket.model");
const User = require("../models/user.model");

async function createTicket(req, res) {
  try {
    const ticketObj = req.body;

    ticketObj.reporter = req.userId;

    // Find a engineer in the DB and set ticketObj.assignee = userId;
    const engineerCount = await User.count({
      userType: USERTYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    });

    const random = Math.floor(Math.random() * engineerCount);
    const assignee = await User.findOne({
      userType: USERTYPES.ENGINEER,
      userStatus: USER_STATUS.APPROVED,
    }).skip(random);

    ticketObj.assignee = assignee.userId;

    const ticket = await Ticket.create(ticketObj);
    res.send(ticket);
  } catch (ex) {
    res.status(500).send({
      message: `Some Error Occured - ${ex.message}`,
    });
  }
}

async function updateTicket(req, res) {
  const { id } = req.params;
  const ticket = await Ticket.findOne({ _id: id });

  //updated body
  if (
    ticket.assignee === req.userId ||
    ticket.reported === req.userId ||
    req.userType === USERTYPES.ADMIN
  ) {
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body);
    res.status(200).send(updateTicket);
  } else {
    response.status(403).send({
      message: "Only the ticket reporter, creater or admin can access this api",
    });
  }
}

async function getAllTickets(req, res) {
  // if the user is and admin, then return all tickets
  // id the user is an engineer, return tickets assigned to them,
  // if the user is a customer, then return ticket created by them

  let filterObj = {};
  if (req.userType === USERTYPES.ENGINEER) {
    filterObj = { assignee: req.userId };
  } else if (req.userType === USERTYPES.CUSTOMER) {
    filterObj = { reporter: req.userId };
  }
  const tickets = await Ticket.find(filterObj);
  res.send(tickets);
}

async function getTicketById(req, res) {
  try {
    const ticket = await Ticket.findById(req.params.id);
    res.send(ticket);
  } catch (ex) {
    res.status(404).send({
      message: `Ticket with id ${req.params.id} not found`,
    });
  }
}
module.exports = {
  createTicket,
  updateTicket,
  getAllTickets,
  getTicketById,
};
