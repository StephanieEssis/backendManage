const Category = require('../models/Category');
const Room = require('../models/Room');

const categoryController = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().sort({ name: 1 });
      
      res.json({
        success: true,
        data: {
          categories,
          count: categories.length
        }
      });
    } catch (error) {
      console.error('Get all categories error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Récupérer les chambres de cette catégorie
      const rooms = await Room.find({ category: category._id })
        .select('name price capacity images')
        .sort({ price: 1 });

      res.json({
        success: true,
        data: {
          category,
          rooms,
          roomCount: rooms.length
        }
      });
    } catch (error) {
      console.error('Get category by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch category',
        error: error.message
      });
    }
  },

  // Create new category (admin only)
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;

      // Validation des données
      if (!name || !description) {
        return res.status(400).json({
          success: false,
          message: 'Please provide name and description'
        });
      }

      // Vérifier si la catégorie existe déjà
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }

      const category = new Category({
        name,
        description
      });

      await category.save();

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create category',
        error: error.message
      });
    }
  },

  // Update category (admin only)
  updateCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Vérifier si le nouveau nom existe déjà
      if (name && name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: 'Category with this name already exists'
          });
        }
        category.name = name;
      }

      if (description) {
        category.description = description;
      }

      await category.save();

      res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Update category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update category',
        error: error.message
      });
    }
  },

  // Delete category (admin only)
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      // Vérifier si la catégorie est utilisée par des chambres
      const roomsWithCategory = await Room.findOne({ category: category._id });
      if (roomsWithCategory) {
        return res.status(400).json({
          success: false,
          message: 'Cannot delete category that is associated with rooms'
        });
      }

      await category.remove();

      res.json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Delete category error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;