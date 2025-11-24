const { supabase } = require('../utils/database');

const adminController = {
  async getDashboard(req, res) {
    try {
      // Get total counts
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });
      
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });
      
      const { data: revenueData } = await supabase
        .from('payments')
        .select('amount')
        .in('payment_type', ['deposit', 'rental'])
        .eq('status', 'completed');
      
      const totalRevenue = revenueData?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      
      // Get monthly revenue (simplified for Supabase)
      const { data: monthlyRevenue } = await supabase
        .from('payments')
        .select('created_at, amount')
        .in('payment_type', ['deposit', 'rental'])
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString());
      
      // Get booking status distribution
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('status');
      
      const bookingStats = allBookings?.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {}) || {};
      
      res.json({
        success: true,
        data: {
          totalUsers: totalUsers || 0,
          totalCars: totalCars || 0,
          totalBookings: totalBookings || 0,
          totalRevenue: totalRevenue,
          monthlyRevenue: monthlyRevenue || [],
          bookingStats: Object.entries(bookingStats).map(([status, count]) => ({ status, count }))
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAllUsers(req, res) {
    try {
      const { page = 1, limit = 10, role, status } = req.query;
      const offset = (page - 1) * limit;
      
      let query = supabase
        .from('profiles')
        .select('id, email, full_name, phone, user_role, user_status, created_at', { count: 'exact' });
      
      if (role) {
        query = query.eq('user_role', role);
      }
      
      if (status) {
        query = query.eq('user_status', status);
      }
      
      const { data: users, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) {
        throw new Error(error.message);
      }
      
      const total = count || 0;
      
      res.json({
        success: true,
        data: {
          users: users || [],
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          user_role: role,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select('id, email, full_name, user_role')
        .single();
      
      if (error || !data) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: { ...data, role: data.user_role } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateUserStatus(req, res) {
    try {
      const { status } = req.body;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({
          user_status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select('id, email, full_name, user_status')
        .single();
      
      if (error || !data) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({ success: true, data: { ...data, status: data.user_status } });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async generateReports(req, res) {
    try {
      // Get recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('id, status, total_amount, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      // Calculate revenue from confirmed bookings (full amount)
      const { data: confirmedBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed');
      
      const confirmedRevenue = confirmedBookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
      
      // Calculate revenue from cancelled bookings (20% cancellation fee)
      const { data: cancelledBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'cancelled');
      
      const cancellationRevenue = cancelledBookings?.reduce((sum, booking) => sum + (booking.total_amount * 0.2), 0) || 0;
      
      // Total revenue = confirmed bookings + cancellation fees
      const totalRevenue = confirmedRevenue + cancellationRevenue;
      
      // Monthly revenue (current month)
      const currentMonth = new Date();
      const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
      
      const { data: monthlyConfirmed } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'confirmed')
        .gte('created_at', firstDayOfMonth);
      
      const { data: monthlyCancelled } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'cancelled')
        .gte('created_at', firstDayOfMonth);
      
      const monthlyConfirmedRevenue = monthlyConfirmed?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
      const monthlyCancellationRevenue = monthlyCancelled?.reduce((sum, booking) => sum + (booking.total_amount * 0.2), 0) || 0;
      const monthlyRevenue = monthlyConfirmedRevenue + monthlyCancellationRevenue;
      
      // Calculate incoming revenue from pending bookings
      const { data: pendingBookings } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'pending');
      
      const incomingRevenue = pendingBookings?.reduce((sum, booking) => sum + booking.total_amount, 0) || 0;
      
      // Get booking status distribution for pie chart
      const { data: allBookings } = await supabase
        .from('bookings')
        .select('status');
      
      const statusDistribution = allBookings?.reduce((acc, booking) => {
        acc[booking.status] = (acc[booking.status] || 0) + 1;
        return acc;
      }, {}) || {};
      
      // Get daily booking trends for line chart (last 30 days)
      const { data: dailyBookings } = await supabase
        .from('bookings')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });
      
      const dailyTrends = {};
      dailyBookings?.forEach(booking => {
        const day = new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!dailyTrends[day]) dailyTrends[day] = 0;
        dailyTrends[day]++;
      });
      
      // Get stats
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      const { count: totalCars } = await supabase
        .from('cars')
        .select('*', { count: 'exact', head: true });
      
      const { count: activeBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      res.json({
        success: true,
        data: {
          stats: {
            totalUsers: totalUsers || 0,
            totalCars: totalCars || 0,
            activeBookings: activeBookings || 0,
            totalRevenue: totalRevenue
          },
          recentBookings: recentBookings || [],
          monthlyRevenue,
          incomingRevenue,
          chartData: {
            statusDistribution,
            dailyTrends
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async handleRefundRequest(req, res) {
    try {
      const { status, admin_notes } = req.body;
      
      const { data, error } = await supabase
        .from('refund_requests')
        .update({
          status,
          admin_notes,
          processed_by: req.user.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select('*')
        .single();
      
      if (error || !data) {
        return res.status(404).json({ success: false, message: 'Refund request not found' });
      }
      
      res.json({ success: true, data });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = adminController;