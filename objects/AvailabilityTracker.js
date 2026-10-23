class AvailabilityTracker {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.vehicles = new Map();
  }

  async checkAvailability(vehicleId, startDate, endDate) {
    const existing = this.state.storage.get("bookings") || [];
    for (const b of existing) {
      const bs = new Date(b.start_date), be = new Date(b.end_date);
      const rs = new Date(startDate), re = new Date(endDate);
      if (rs < be && re > bs) return { available: false, conflicting: b };
    }
    const newB = { vehicle_id: vehicleId, start_date: startDate, end_date: endDate, booked_at: new Date().toISOString() };
    this.state.storage.put("bookings", [...existing, newB]);
    this.vehicles.set(vehicleId, { available: true });
    return { available: true };
  }

  releaseBooking(vehicleId, bookingId) {
    const existing = this.state.storage.get("bookings") || [];
    this.state.storage.put("bookings", existing.filter(b => b.booking_id !== bookingId && b.vehicle_id !== vehicleId));
    this.vehicles.delete(vehicleId);
    return { success: true };
  }

  getVehicleBookings(vehicleId) {
    return this.state.storage.get("bookings") || [];
  }

  getAllBookings() {
    return this.state.storage.get("bookings") || [];
  }
}

export { AvailabilityTracker };
export default AvailabilityTracker;