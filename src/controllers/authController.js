const { supabase } = require('../utils/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ApiResponse } = require('../utils/apiResponse');

// Register new user
exports.register = async (req, res) => {
  const { email, password, full_name, phone } = req.body;

  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return ApiResponse.error(res, 'User already exists', 400);
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user in Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) {
      return ApiResponse.error(res, 'Failed to create user account', 400);
    }

    // Create profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authUser.user.id,
        email,
        full_name,
        phone,
        user_role: 'customer',
        user_status: 'active'
      }])
      .select('*')
      .single();

    if (profileError) {
      return ApiResponse.error(res, 'Failed to create user profile', 400);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: profile.id, 
        email: profile.email, 
        role: profile.user_role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return ApiResponse.success(res, {
      token,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.user_role
      }
    }, 'Registration successful');

  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get user profile
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .eq('user_status', 'active')
      .single();

    if (error || !profile) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    // Verify password with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return ApiResponse.error(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: profile.id, 
        email: profile.email, 
        role: profile.user_role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return ApiResponse.success(res, {
      token,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.user_role
      }
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, phone, user_role, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return ApiResponse.error(res, 'Profile not found', 404);
    }

    return ApiResponse.success(res, profile);
  } catch (error) {
    console.error('Get profile error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const { full_name, phone } = req.body;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ full_name, phone, updated_at: new Date() })
      .eq('id', req.user.id)
      .select('*')
      .single();

    if (error) {
      return ApiResponse.error(res, 'Failed to update profile', 400);
    }

    return ApiResponse.success(res, {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      role: profile.user_role
    }, 'Profile updated successfully');

  } catch (error) {
    console.error('Update profile error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};

// Logout (client-side token removal)
exports.logout = async (req, res) => {
  return ApiResponse.success(res, null, 'Logout successful');
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Verify current password with Supabase Auth
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', req.user.id)
      .single();

    if (!profile) {
      return ApiResponse.error(res, 'User not found', 404);
    }

    // Verify current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword
    });

    if (signInError) {
      return ApiResponse.error(res, 'Current password is incorrect', 400);
    }

    // Update password in Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      req.user.id,
      { password: newPassword }
    );

    if (updateError) {
      return ApiResponse.error(res, 'Failed to update password', 400);
    }

    return ApiResponse.success(res, null, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    // Check for active bookings
    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', req.user.id)
      .in('status', ['pending', 'confirmed', 'active']);

    if (activeBookings && activeBookings.length > 0) {
      return ApiResponse.error(res, 'Cannot delete account with active bookings', 400);
    }

    // Delete profile first (due to foreign key constraint)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', req.user.id);

    if (profileError) {
      return ApiResponse.error(res, 'Failed to delete profile', 400);
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(
      req.user.id
    );

    if (authError) {
      console.error('Auth deletion error:', authError);
      // Profile is already deleted, so we'll consider this a success
    }

    return ApiResponse.success(res, null, 'Account deleted successfully');
  } catch (error) {
    console.error('Delete account error:', error);
    return ApiResponse.error(res, 'Internal server error');
  }
};