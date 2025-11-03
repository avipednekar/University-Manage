import React, { useState, useEffect } from 'react';
import { hostelAPI, roomAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaHotel, FaDoorOpen } from 'react-icons/fa';

const HostelPage = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  const [hostelForm, setHostelForm] = useState({ hostel_name: '', location: '', capacity: '' });
  // Removed capacity from roomForm state
  const [roomForm, setRoomForm] = useState({ room_number: '', hostel_id: '', room_type: '' });
  const [activeTab, setActiveTab] = useState('hostels');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hostelsRes, roomsRes] = await Promise.all([
        hostelAPI.getAll(),
        roomAPI.getAll()
      ]);
      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHostelSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHostel) {
        await hostelAPI.update(editingHostel.hostel_id, hostelForm);
      } else {
        await hostelAPI.create(hostelForm);
      }
      fetchData();
      handleCloseHostelModal();
    } catch (error) {
      console.error('Error saving hostel:', error);
      alert('Failed to save hostel');
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        // editingRoom.room_id is the synthetic key 'hostel_id-room_number'
        await roomAPI.update(editingRoom.room_id, roomForm);
      } else {
        await roomAPI.create(roomForm);
      }
      fetchData();
      handleCloseRoomModal();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Failed to save room');
    }
  };

  const handleDeleteHostel = async (id) => {
    if (window.confirm('Are you sure? This will delete all associated rooms!')) {
      try {
        await hostelAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting hostel:', error);
        alert('Failed to delete hostel');
      }
    }
  };

  const handleDeleteRoom = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        // `id` is the synthetic key 'hostel_id-room_number'
        await roomAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room');
      }
    }
  };

  const handleEditHostel = (hostel) => {
    setEditingHostel(hostel);
    setHostelForm({ 
      hostel_name: hostel.hostel_name, 
      location: hostel.location, 
      capacity: hostel.capacity 
    });
    setShowHostelModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({ 
      room_number: room.room_number, 
      hostel_id: room.hostel_id, 
      room_type: room.room_type, 
      // capacity: room.capacity // Removed
    });
    setShowRoomModal(true);
  };

  const handleCloseHostelModal = () => {
    setShowHostelModal(false);
    setEditingHostel(null);
    setHostelForm({ hostel_name: '', location: '', capacity: '' });
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    // Removed capacity
    setRoomForm({ room_number: '', hostel_id: '', room_type: '' });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hostel & Room Management</h1>
        <p className="page-description">Manage hostels and their rooms</p>
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('hostels')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'hostels' ? '#2563eb' : 'transparent',
            color: activeTab === 'hostels' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0',
            marginRight: '8px'
          }}
        >
          <FaHotel style={{ marginRight: '8px' }} />
          Hostels
        </button>
        <button 
          onClick={() => setActiveTab('rooms')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'rooms' ? '#2563eb' : 'transparent',
            color: activeTab === 'rooms' ? 'white' : '#64748b',
            fontWeight: '600',
            cursor: 'pointer',
            borderRadius: '6px 6px 0 0'
          }}
        >
          <FaDoorOpen style={{ marginRight: '8px' }} />
          Rooms
        </button>
      </div>

      {activeTab === 'hostels' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Hostels</h2>
            <button className="btn btn-primary" onClick={() => setShowHostelModal(true)}>
              <FaPlus /> Add Hostel
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Hostel Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostels.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                      No hostels found. Add your first hostel!
                    </td>
                  </tr>
                ) : (
                  hostels.map((hostel) => (
                    <tr key={hostel.hostel_id}>
                      <td>{hostel.hostel_name}</td>
                      <td>{hostel.location}</td>
                      <td>{hostel.capacity}</td>
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEditHostel(hostel)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteHostel(hostel.hostel_id)}>
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
      )}

      {activeTab === 'rooms' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">All Rooms</h2>
            <button className="btn btn-primary" onClick={() => setShowRoomModal(true)}>
              <FaPlus /> Add Room
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Hostel</th>
                  <th>Room Type</th>
                  {/* <th>Capacity</th> Removed */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}> {/* Adjusted colSpan */}
                      No rooms found. Add your first room!
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    // room.room_id is now the synthetic key 'hostel_id-room_number'
                    <tr key={room.room_id}>
                      <td>{room.room_number}</td>
                      <td>{hostels.find(h => h.hostel_id === room.hostel_id)?.hostel_name || 'N/A'}</td>
                      <td><span className="badge badge-primary">{room.room_type}</span></td>
                      {/* <td>{room.capacity}</td> Removed */}
                      <td>
                        <div className="table-actions">
                          <button className="btn btn-sm btn-primary" onClick={() => handleEditRoom(room)}>
                            <FaEdit />
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteRoom(room.room_id)}>
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
      )}

      {/* Hostel Modal - Unchanged */}
      <Modal
        isOpen={showHostelModal}
        onClose={handleCloseHostelModal}
        title={editingHostel ? 'Edit Hostel' : 'Add New Hostel'}
        footer={
          <>
            <button className="btn" onClick={handleCloseHostelModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleHostelSubmit}>
              {editingHostel ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleHostelSubmit}>
          <div className="form-group">
            <label className="form-label required">Hostel Name</label>
            <input
              type="text"
              className="form-input"
              value={hostelForm.hostel_name}
              onChange={(e) => setHostelForm({ ...hostelForm, hostel_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Location</label>
            <input
              type="text"
              className="form-input"
              value={hostelForm.location}
              onChange={(e) => setHostelForm({ ...hostelForm, location: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Capacity</label>
            <input
              type="number"
              className="form-input"
              value={hostelForm.capacity}
              onChange={(e) => setHostelForm({ ...hostelForm, capacity: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Room Modal */}
      <Modal
        isOpen={showRoomModal}
        onClose={handleCloseRoomModal}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
        footer={
          <>
            <button className="btn" onClick={handleCloseRoomModal}>Cancel</button>
            <button className="btn btn-primary" onClick={handleRoomSubmit}>
              {editingRoom ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form onSubmit={handleRoomSubmit}>
          <div className="form-group">
            <label className="form-label required">Room Number</label>
            <input
              type="text"
              className="form-input"
              value={roomForm.room_number}
              onChange={(e) => setRoomForm({ ...roomForm, room_number: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label required">Hostel</label>
            <select
              className="form-select"
              value={roomForm.hostel_id}
              onChange={(e) => setRoomForm({ ...roomForm, hostel_id: e.target.value })}
              required
            >
              <option value="">Select Hostel</option>
              {hostels.map((hostel) => (
                <option key={hostel.hostel_id} value={hostel.hostel_id}>
                  {hostel.hostel_name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label required">Room Type</label>
            <select
              className="form-select"
              value={roomForm.room_type}
              onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value })}
              required
            >
              <option value="">Select Type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Triple">Triple</option>
              <option value="Quad">Quad</option>
            </select>
          </div>
          {/* <div className="form-group">
            <label className="form-label required">Capacity</label>
            <input
              type="number"
              className="form-input"
              value={roomForm.capacity}
              onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
              required
              min="1"
              max="4"
            />
          </div> Removed */}
        </form>
      </Modal>
    </div>
  );
};

export default HostelPage;