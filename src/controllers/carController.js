const carService = require('../services/carService');

const carController = {
  async getAllCars(req, res) {
    try {
      const { page = 1, limit = 10, type, fuel_type, availability_status } = req.query;
      const cars = await carService.getAllCars({ page, limit, type, fuel_type, availability_status });
      res.json({ success: true, data: cars });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getCarById(req, res) {
    try {
      const car = await carService.getCarById(req.params.id);
      if (!car) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
      res.json({ success: true, data: car });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async createCar(req, res) {
    try {
      console.log('Creating car with data:', req.body);
      
      const carData = { ...req.body, created_by: req.user?.id || '10e78cbf-c04a-4391-bb26-7c39fbe6a43c' };
      const car = await carService.createCar(carData);
      
      console.log('Car created successfully:', car);
      res.status(201).json({ success: true, data: car });
    } catch (error) {
      console.error('Create car error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async updateCar(req, res) {
    try {
      const car = await carService.updateCar(req.params.id, req.body);
      if (!car) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
      res.json({ success: true, data: car });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async deleteCar(req, res) {
    try {
      const deleted = await carService.deleteCar(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
      res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async updateCarStatus(req, res) {
    try {
      const { availability_status } = req.body;
      const car = await carService.updateCarStatus(req.params.id, availability_status);
      if (!car) {
        return res.status(404).json({ success: false, message: 'Car not found' });
      }
      res.json({ success: true, data: car });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async searchCars(req, res) {
    try {
      const { q, type, fuel_type, min_rate, max_rate } = req.query;
      const cars = await carService.searchCars({ q, type, fuel_type, min_rate, max_rate });
      res.json({ success: true, data: cars });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async checkAvailability(req, res) {
    try {
      const { car_id, start_date, end_date } = req.query;
      const isAvailable = await carService.checkAvailability(car_id, start_date, end_date);
      res.json({ success: true, data: { available: isAvailable } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAvailableCars(req, res) {
    try {
      const cars = await carService.getAvailableCars();
      res.json({ success: true, data: cars });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async uploadCarImage(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const fileName = `cars/${Date.now()}-${req.file.originalname}`;
      const { uploadCarImage, getPublicUrl } = require('../utils/database');
      
      await uploadCarImage(req.file.buffer, fileName);
      const publicUrl = getPublicUrl(fileName);

      res.json({ success: true, data: { url: publicUrl }, message: 'Image uploaded successfully' });
    } catch (error) {
      console.error('Car image upload error:', error);
      res.status(500).json({ success: false, message: 'Failed to upload image' });
    }
  }
};

module.exports = carController;