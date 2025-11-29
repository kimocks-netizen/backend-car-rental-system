const { Resend } = require('resend');

const resend = new Resend('re_gHQZVsHx_6jsaKHZGWGNrjWNqjeBHtEa8');

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://car-rental-system-fn-b1q3.vercel.app' 
    : 'http://localhost:3000';
};

const sendBookingConfirmationEmail = async (email, bookingData, carData) => {
  try {
    console.log('📧 sendBookingConfirmationEmail called with:', { email, bookingId: bookingData?.id, carId: carData?.id });
    const baseUrl = getBaseUrl();
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@carogroupinvestments.com',
      to: email,
      subject: 'Booking Confirmation - Car Rental System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc3545; margin: 0; font-size: 28px;">🚗 Booking Confirmed!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Your car rental request has been submitted successfully</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #dc3545;">
              <h3 style="color: #dc3545; margin: 0 0 15px 0;">Booking Details</h3>
              <p style="margin: 5px 0; color: #495057;"><strong>Booking ID:</strong> ${bookingData.id}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Status:</strong> <span style="color: #ffc107; font-weight: bold;">Pending Approval</span></p>
              <p style="margin: 5px 0; color: #495057;"><strong>Pickup Date:</strong> ${new Date(bookingData.start_date).toLocaleDateString()}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Return Date:</strong> ${new Date(bookingData.end_date).toLocaleDateString()}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Pickup Location:</strong> ${bookingData.pickup_location}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Drop-off Location:</strong> ${bookingData.dropoff_location}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
              <h3 style="color: #28a745; margin: 0 0 15px 0;">Vehicle Information</h3>
              <p style="margin: 5px 0; color: #495057;"><strong>Car:</strong> ${carData.make} ${carData.model}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Type:</strong> ${carData.type}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Daily Rate:</strong> £${carData.daily_rate}</p>
              <p style="margin: 5px 0; color: #495057;"><strong>Total Amount:</strong> £${bookingData.total_amount}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/bookings" style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View Booking Details
              </a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 8px; margin-top: 25px;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                <strong>What's Next?</strong><br>
                • Our team will review your booking request<br>
                • You'll receive a confirmation email once approved<br>
                • Please ensure you have a valid driving license<br>
                • Contact us if you have any questions
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d; margin: 0;">
                This email was sent from Car Rental System. If you have any questions, please contact our support team.<br>
                <em>Note: Car Rental System is currently using a rented domain for demo purposes.</em>
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      throw error;
    }
    console.log('✅ Email sent successfully via Resend:', data);
    return { success: true };
  } catch (error) {
    console.error('❌ Booking confirmation email error:', error);
    throw new Error('Failed to send booking confirmation email');
  }
};

const sendBookingApprovedEmail = async (email, bookingData, carData) => {
  try {
    const baseUrl = getBaseUrl();
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@carogroupinvestments.com',
      to: email,
      subject: 'Booking Approved - Car Rental System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #28a745; margin: 0; font-size: 28px;">✅ Booking Approved!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Your car rental booking has been confirmed</p>
            </div>
            
            <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #28a745;">
              <h3 style="color: #155724; margin: 0 0 15px 0;">Confirmed Booking Details</h3>
              <p style="margin: 5px 0; color: #155724;"><strong>Booking ID:</strong> ${bookingData.id}</p>
              <p style="margin: 5px 0; color: #155724;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></p>
              <p style="margin: 5px 0; color: #155724;"><strong>Pickup Date:</strong> ${new Date(bookingData.start_date).toLocaleDateString()}</p>
              <p style="margin: 5px 0; color: #155724;"><strong>Return Date:</strong> ${new Date(bookingData.end_date).toLocaleDateString()}</p>
              <p style="margin: 5px 0; color: #155724;"><strong>Vehicle:</strong> ${carData.make} ${carData.model}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/bookings" style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                View Booking
              </a>
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                <strong>Important Reminders:</strong><br>
                • Bring a valid driving license on pickup day<br>
                • Arrive 15 minutes early for vehicle inspection<br>
                • Security deposit will be processed on pickup<br>
                • Contact us for any changes or questions
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d; margin: 0;">
                This email was sent from Car Rental System. If you have any questions, please contact our support team.<br>
                <em>Note: Car Rental System is currently using a rented domain for demo purposes.</em>
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Booking approved email error:', error);
    throw new Error('Failed to send booking approved email');
  }
};

const sendBookingActiveEmail = async (email, bookingData, carData) => {
  try {
    const baseUrl = getBaseUrl();
    
    const { data, error } = await resend.emails.send({
      from: 'noreply@carogroupinvestments.com',
      to: email,
      subject: 'Rental Started - Car Rental System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #007bff; margin: 0; font-size: 28px;">🚙 Rental Active!</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Your car rental period has started</p>
            </div>
            
            <div style="background: #cce5ff; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #007bff;">
              <h3 style="color: #004085; margin: 0 0 15px 0;">Active Rental</h3>
              <p style="margin: 5px 0; color: #004085;"><strong>Booking ID:</strong> ${bookingData.id}</p>
              <p style="margin: 5px 0; color: #004085;"><strong>Vehicle:</strong> ${carData.make} ${carData.model}</p>
              <p style="margin: 5px 0; color: #004085;"><strong>Return Due:</strong> ${new Date(bookingData.end_date).toLocaleDateString()}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
              <p style="margin: 0; font-size: 14px; color: #856404;">
                <strong>Rental Guidelines:</strong><br>
                • Return the vehicle on time to avoid late fees<br>
                • Report any issues immediately<br>
                • Keep the vehicle clean and undamaged<br>
                • Follow all traffic laws and regulations
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d; margin: 0;">
                This email was sent from Car Rental System. If you have any questions, please contact our support team.<br>
                <em>Note: Car Rental System is currently using a rented domain for demo purposes.</em>
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Booking active email error:', error);
    throw new Error('Failed to send booking active email');
  }
};

const sendBookingCancelledEmail = async (email, bookingData, carData, reason = '') => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'noreply@carogroupinvestments.com',
      to: email,
      subject: 'Booking Cancelled - Car Rental System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
          <div style="background: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc3545; margin: 0; font-size: 28px;">❌ Booking Cancelled</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Your car rental booking has been cancelled</p>
            </div>
            
            <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #dc3545;">
              <h3 style="color: #721c24; margin: 0 0 15px 0;">Cancelled Booking</h3>
              <p style="margin: 5px 0; color: #721c24;"><strong>Booking ID:</strong> ${bookingData.id}</p>
              <p style="margin: 5px 0; color: #721c24;"><strong>Vehicle:</strong> ${carData.make} ${carData.model}</p>
              <p style="margin: 5px 0; color: #721c24;"><strong>Original Dates:</strong> ${new Date(bookingData.start_date).toLocaleDateString()} - ${new Date(bookingData.end_date).toLocaleDateString()}</p>
              ${reason ? `<p style="margin: 5px 0; color: #721c24;"><strong>Reason:</strong> ${reason}</p>` : ''}
            </div>
            
            <div style="background: #e9ecef; padding: 15px; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #6c757d;">
                If you have any questions about this cancellation or need to make a new booking, please contact our customer service team.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="font-size: 12px; color: #6c757d; margin: 0;">
                This email was sent from Car Rental System. If you have any questions, please contact our support team.<br>
                <em>Note: Car Rental System is currently using a rented domain for demo purposes.</em>
              </p>
            </div>
          </div>
        </div>
      `
    });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Booking cancelled email error:', error);
    throw new Error('Failed to send booking cancelled email');
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingApprovedEmail,
  sendBookingActiveEmail,
  sendBookingCancelledEmail
};