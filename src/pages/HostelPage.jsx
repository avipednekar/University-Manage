import React, { useState, useEffect } from 'react';
import { hostelAPI, roomAPI } from '../api/api';
import Modal from '../components/Common/Modal';
import { FaPlus, FaEdit, FaTrash, FaHotel, FaDoorOpen } from 'react-icons/fa';

// Define the initial state for the new, complex form
const initialHostelFormState = {
  hostel_id: '',
  hostel_name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  NumberOfSeats: ''
};

const HostelPage = () => {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHostelModal, setShowHostelModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingHostel, setEditingHostel] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);
  
  // Use the new initial state
  const [hostelForm, setHostelForm] = useState(initialHostelFormState);
  
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
      // The backend GET route now provides *both* aliased and raw data.
      // The table will use `location` and `capacity`.
      // The edit modal will use the new raw fields.
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
      // The backend POST/PUT routes now expect the full object
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
    // Populate the new complex form.
    // The `GET /hostels` route now provides all these fields.
    setHostelForm({ 
      hostel_id: hostel.hostel_id,
      hostel_name: hostel.hostel_name,
      address: hostel.address || '',
      city: hostel.city || '',
      state: hostel.state || '',
      pincode: hostel.pincode || '',
      NumberOfSeats: hostel.numberofseats // Use the raw DB column name
    });
    setShowHostelModal(true);
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({ 
      room_number: room.room_number, 
      hostel_id: room.hostel_id, 
      room_type: room.room_type, 
    });
    setShowRoomModal(true);
  };

  const handleCloseHostelModal = () => {
    setShowHostelModal(false);
    setEditingHostel(null);
    setHostelForm(initialHostelFormState); // Reset to the new initial state
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomForm({ room_number: '', hostel_id: '', room_type: '' });
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Hostel & Room Management</h1>
        <p className="page-description">Manage hostels and their rooms</p>
      </div>

      {/* Tabs remain the same */}
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
                  <th>Hostel ID</th>
                  <th>Hostel Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hostels.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      No hostels found. Add your first hostel!
                    </td>
                  </tr>
                ) : (
                  hostels.map((hostel) => (
                    <tr key={hostel.hostel_id}>
                      <td>{hostel.hostel_id}</td>
                      <td>{hostel.hostel_name}</td>
                      {/* This uses the aliased 'location' field from the GET route */}
                      <td>{hostel.location}</td>
                      {/* This uses the aliased 'capacity' field */}
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

      {/* Room tab remains the same */}
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                      No rooms found. Add your first room!
                    </td>
                  </tr>
                ) : (
                  rooms.map((room) => (
                    <tr key={room.room_id}>
                      <td>{room.room_number}</td>
                      <td>{hostels.find(h => h.hostel_id === room.hostel_id)?.hostel_name || 'N/A'}</td>
                      <td><span className="badge badge-primary">{room.room_type}</span></td>
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


      {/* --- HOSTEL MODAL (UPDATED) --- */}
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
          {/* Grid for ID and Name */}
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label required">Hostel ID</label>
              <input
                type="number"
                className="form-input"
                value={hostelForm.hostel_id}
                onChange={(e) => setHostelForm({ ...hostelForm, hostel_id: e.target.value })}
                required
                disabled={editingHostel}
              />
            </div>
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
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={hostelForm.address}
              onChange={(e) => setHostelForm({ ...hostelForm, address: e.target.value })}
            />
          </div>

          {/* Grid for City, State, Pincode */}
          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={hostelForm.city}
                onChange={(e) => setHostelForm({ ...hostelForm, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={hostelForm.state}
                onChange={(e) => setHostelForm({ ...hostelForm, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pincode</label>
              <input
                type="number"
                className="form-input"
                value={hostelForm.pincode}
                onChange={(e) => setHostelForm({ ...hostelForm, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* Number of Seats (Capacity) */}
          <div className="form-group">
            <label className="form-label required">Number of Seats</label>
            <input
              type="number"
              className="form-input"
              value={hostelForm.NumberOfSeats}
              onChange={(e) => setHostelForm({ ...hostelForm, NumberOfSeats: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* --- ROOM MODAL (Unchanged) --- */}
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
        </form>
      </Modal>
    </div>
  );
};

export default HostelPage;