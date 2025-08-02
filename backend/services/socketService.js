let io;

const setupSocket = (socketIo) => {
  io = socketIo;

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user to their personal room
    socket.on('join_user_room', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join agents to agent room
    socket.on('join_agent_room', () => {
      socket.join('agents');
      console.log('Agent joined agent room');
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};

const emitTicketUpdate = (event, data) => {
  if (io) {
    // Emit to all agents
    io.to('agents').emit(event, data);

    // If it's a specific ticket update, emit to the ticket creator
    if (data.user_id) {
      io.to(`user_${data.user_id}`).emit(event, data);
    }
  }
};

module.exports = {
  setupSocket,
  emitTicketUpdate
};
