import React, { useState, useEffect } from 'react';
import { departmentAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ dept_name: '', building: '', budget: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentAPI.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentAPI.update(editingDept.dept_name, formData);
      } else {
        await departmentAPI.create(formData);
      }
      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving department:', error);
      setErrors({ submit: 'Failed to save department' });
    }
  };

  const handleDelete = async (deptName) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentAPI.delete(deptName);
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
      }
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ dept_name: dept.dept_name, building: dept.building, budget: dept.budget });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDept(null);
    setFormData({ dept_name: '', building: '', budget: '' });
    setErrors({});
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Department Management</h1>
        <p className="page-description">Manage all university departments</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Departments</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <FaPlus /> Add Department
          </button>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Building</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                    No departments found. Add your first department!
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr key={dept.dept_name}>
                    <td>{dept.dept_name}</td>
                    <td>{dept.building}</td>
                    <td>${dept.budget?.toLocaleString()}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-sm btn-primary" onClick={() => handleEdit(dept)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(dept.dept_name)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingDept ? 'Edit Department' : 'Add New Department'}
        footer={
          <>
            <button className="btn" onClick={handleCloseModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {editingDept ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Department Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.dept_name}
              onChange={(e) => setFormData({ ...formData, dept_name: e.target.value })}
              required
              disabled={editingDept}
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Building</label>
            <input
              type="text"
              className="form-input"
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Budget</label>
            <input
              type="number"
              className="form-input"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>
          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentPage;