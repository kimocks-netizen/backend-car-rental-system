const emailService = {
  async sendBookingConfirmation(userEmail, bookingDetails) {
    // Mock email service - replace with actual email provider
    console.log(`Sending booking confirmation to ${userEmail}:`, bookingDetails);
    return { success: true, message: 'Email sent successfully' };
  },

  async sendBookingCancellation(userEmail, bookingDetails) {
    console.log(`Sending booking cancellation to ${userEmail}:`, bookingDetails);
    return { success: true, message: 'Email sent successfully' };
  },

  async sendPaymentConfirmation(userEmail, paymentDetails) {
    console.log(`Sending payment confirmation to ${userEmail}:`, paymentDetails);
    return { success: true, message: 'Email sent successfully' };
  },

  async sendRefundNotification(userEmail, refundDetails) {
    console.log(`Sending refund notification to ${userEmail}:`, refundDetails);
    return { success: true, message: 'Email sent successfully' };
  }
};

module.exports = emailService;