import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes, FaCalendarAlt, FaHotel, FaBed, FaTrash, FaEdit, FaPlus, FaSave, FaUndo } from 'react-icons/fa';
import { useAdmin } from '../contexts/AdminContext';
import './AdminDashboard.css';

const AdminDashboard = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { getAuthHeaders } = useAdmin();
  const [newItem, setNewItem] = useState(null);

  const [modalRoot] = useState(() => {
    let element = document.getElementById("admin-dashboard-root");
    if (!element) {
      element = document.createElement("div");
      element.id = "admin-dashboard-root";
      document.body.appendChild(element);
    }
    return element;
  });

  // Lock scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const endpoints = {
        bookings: 'http://127.0.0.1:8000/bookings/',
        hotels: 'http://127.0.0.1:8000/hotels/',
        rooms: 'http://127.0.0.1:8000/rooms/'
      };
      
      const response = await fetch(endpoints[activeTab], {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${activeTab}`);
      }
      
      const data = await response.json();
      
      switch (activeTab) {
        case 'bookings':
          // Process bookings to include customer and room names
          const enhancedBookings = await Promise.all(data.map(async (booking) => {
            // Fetch customer data
            const customerResponse = await fetch(booking.customer, {
              headers: getAuthHeaders(),
            });
            
            // Fetch room data
            const roomResponse = await fetch(booking.room, {
              headers: getAuthHeaders(),
            });
            
            let customerData = {};
            let roomData = {};
            
            if (customerResponse.ok) {
              customerData = await customerResponse.json();
            }
            
            if (roomResponse.ok) {
              roomData = await roomResponse.json();
            }
            
            return {
              ...booking,
              customerName: customerData.name || 'Unknown',
              roomName: roomData.name || 'Unknown'
            };
          }));
          
          setBookings(enhancedBookings);
          break;
        case 'hotels':
          setHotels(data);
          break;
        case 'rooms':
          // Process rooms to include hotel names
          const enhancedRooms = await Promise.all(data.map(async (room) => {
            // Fetch hotel data
            const hotelResponse = await fetch(room.hotel, {
              headers: getAuthHeaders(),
            });
            
            let hotelData = {};
            
            if (hotelResponse.ok) {
              hotelData = await hotelResponse.json();
            }
            
            return {
              ...room,
              hotelName: hotelData.name || 'Unknown Hotel'
            };
          }));
          
          setRooms(enhancedRooms);
          break;
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (endpoint, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${endpoint}${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
      
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      setError(error.message);
    }
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowAddForm(false);
  };

  const handleSave = async () => {
    if (!editingItem) return;
    
    try {
      const endpoints = {
        bookings: 'http://127.0.0.1:8000/bookings/',
        hotels: 'http://127.0.0.1:8000/hotels/',
        rooms: 'http://127.0.0.1:8000/rooms/'
      };
      
      const response = await fetch(`${endpoints[activeTab]}${editingItem.id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(editingItem),
      });
      
      if (!response.ok) {
        throw new Error('Save failed');
      }
      
      setEditingItem(null);
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      setError(error.message);
    }
  };

  const handleAdd = async (newItem) => {
    try {
      const endpoints = {
        hotels: 'http://127.0.0.1:8000/hotels/',
        rooms: 'http://127.0.0.1:8000/rooms/'
      };
      
      const response = await fetch(endpoints[activeTab], {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem),
      });
      
      if (!response.ok) {
        throw new Error('Add failed');
      }
      
      setShowAddForm(false);
      fetchData();
    } catch (error) {
      console.error('Add error:', error);
      setError(error.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('admin-dashboard-overlay')) {
      onClose();
    }
  };

  const tabs = [
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'hotels', label: 'Hotels', icon: <FaHotel /> },
    { id: 'rooms', label: 'Rooms', icon: <FaBed /> },
  ];

  const renderBookings = () => (
    <div className="data-table-container">
      <h3>Manage Bookings</h3>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Room</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.roomName}</td>
                  <td>{booking.check_in_date}</td>
                  <td>{booking.check_out_date}</td>
                  <td>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(booking)}
                        title="Edit booking"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete('http://127.0.0.1:8000/bookings/', booking.id)}
                        title="Cancel booking"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderHotels = () => (
    <div className="data-table-container">
      <div className="section-header">
        <h3>Manage Hotels</h3>
        <button 
          className="add-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditingItem(null);
            setNewItem(getEmptyItem());
          }}
        >
          <FaPlus /> Add Hotel
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Email Address</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.id}</td>
                  <td>{hotel.name}</td>
                  <td>{hotel.location || 'N/A'}</td>
                  <td>{hotel.contact_info}</td>
                  <td>
                    {hotel.number_of_ratings > 0 
                      ? (hotel.sum_of_ratings / hotel.number_of_ratings).toFixed(1)
                      : 'No ratings'
                    }
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(hotel)}
                        title="Edit hotel"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete('http://127.0.0.1:8000/hotels/', hotel.id)}
                        title="Delete hotel"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderRooms = () => (
    <div className="data-table-container">
      <div className="section-header">
        <h3>Manage Rooms</h3>
        <button 
          className="add-btn"
          onClick={() => {
            setShowAddForm(true);
            setEditingItem(null);
            setNewItem(getEmptyItem());
          }}
        >
          <FaPlus /> Add Room
        </button>
      </div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Hotel</th>
                <th>Base Price</th>
                <th>Available</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.name}</td>
                  <td>{room.type}</td>
                  <td>{room.hotelName}</td> {/* Replace room.hotel with room.hotelName */}
                  <td>{room.pricePerNight} {room.currency}</td>
                  <td>
                    <span className={`status-badge ${room.availability ? 'available' : 'unavailable'}`}>
                      {room.availability ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(room)}
                        title="Edit room"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete('http://127.0.0.1:8000/rooms/', room.id)}
                        title="Delete room"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderEditForm = () => {
  if (!editingItem && !showAddForm) return null;

  const isEditing = !!editingItem;
  const currentItem = editingItem || newItem || getEmptyItem();

  return (
    <div className="edit-form-overlay">
      <div className="edit-form">
        <h4>{isEditing ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h4>
        {renderFormFields(currentItem, isEditing)}
        <div className="form-actions">
          <button 
            className="cancel-btn"
            onClick={() => {
              setEditingItem(null);
              setShowAddForm(false);
              setNewItem(null); // Reset new item
            }}
          >
            <FaUndo /> Cancel
          </button>
          <button 
            className="save-btn"
            onClick={isEditing ? handleSave : () => handleAdd(currentItem)}
          >
            <FaSave /> {isEditing ? 'Save' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

  const getEmptyItem = () => {
    switch (activeTab) {
      case 'hotels':
        return {
          name: '',
          location: '',
          description: '',
          contact_info: '',
          sum_of_ratings: 0,
          number_of_ratings: 0
        };
      case 'rooms':
        return {
          name: '',
          type: 'single',
          pricePerNight: 0,
          currency: 'RON',
          maxOccupancy: 1,
          description: '',
          availability: true,
          hotel: ''
        };
      default:
        return {};
    }
  };

  const renderFormFields = (item, isEditing) => {
    const updateItem = (field, value) => {
      if (isEditing) {
        setEditingItem({ ...editingItem, [field]: value });
      } else {
        // For new items, update the newItem state
        setNewItem(prevItem => ({ ...prevItem, [field]: value }));
      }
    };
    switch (activeTab) {
      case 'bookings':
        return (
          <div className="form-fields">
            <div className="field-group">
              <label>Status:</label>
              <select 
                value={item.status} 
                onChange={(e) => updateItem('status', e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="field-group">
              <label>Number of People:</label>
              <input 
                type="number" 
                value={item.number_of_people} 
                onChange={(e) => updateItem('number_of_people', parseInt(e.target.value))}
              />
            </div>
          </div>
        );
      case 'hotels':
        return (
          <div className="form-fields">
            <div className="field-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={item.name} 
                onChange={(e) => updateItem('name', e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label>Location:</label>
              <input 
                type="text" 
                value={item.location || ''} 
                onChange={(e) => updateItem('location', e.target.value)}
              />
            </div>
            <div className="field-group">
              <label>Description:</label>
              <textarea 
                value={item.description} 
                onChange={(e) => updateItem('description', e.target.value)}
                rows="3"
              />
            </div>
            <div className="field-group">
              <label>Contact Info:</label>
              <input 
                type="text" 
                value={item.contact_info} 
                onChange={(e) => updateItem('contact_info', e.target.value)}
              />
            </div>
          </div>
        );
      case 'rooms':
        return (
          <div className="form-fields">
            <div className="field-group">
              <label>Name:</label>
              <input 
                type="text" 
                value={item.name} 
                onChange={(e) => updateItem('name', e.target.value)}
                required
              />
            </div>
            <div className="field-group">
              <label>Type:</label>
              <select 
                value={item.type} 
                onChange={(e) => updateItem('type', e.target.value)}
              >
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
                <option value="deluxe">Deluxe</option>
              </select>
            </div>
            <div className="field-group">
              <label>Price per Night:</label>
              <input 
                type="number" 
                step="0.01"
                value={item.pricePerNight} 
                onChange={(e) => updateItem('pricePerNight', parseFloat(e.target.value))}
              />
            </div>
            <div className="field-group">
              <label>Currency:</label>
              <select 
                value={item.currency} 
                onChange={(e) => updateItem('currency', e.target.value)}
              >
                <option value="RON">RON</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="field-group">
              <label>Max Occupancy:</label>
              <input 
                type="number" 
                value={item.maxOccupancy} 
                onChange={(e) => updateItem('maxOccupancy', parseInt(e.target.value))}
              />
            </div>
            <div className="field-group">
              <label>Description:</label>
              <textarea 
                value={item.description} 
                onChange={(e) => updateItem('description', e.target.value)}
                rows="3"
              />
            </div>
            <div className="field-group">
              <label>
                <input 
                  type="checkbox" 
                  checked={item.availability} 
                  onChange={(e) => updateItem('availability', e.target.checked)}
                />
                Available
              </label>
            </div>
            {!isEditing && (
              <div className="field-group">
                <label>Hotel:</label>
                <select 
                  value={item.hotel} 
                  onChange={(e) => updateItem('hotel', e.target.value)}
                  required
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.url} value={hotel.url}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const modalContent = (
    <div className="admin-dashboard-overlay" onClick={handleOverlayClick}>
      <div className="admin-dashboard-modal">
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
        
        <div className="admin-dashboard-header">
          <h2>Admin Dashboard</h2>
        </div>
        
        <div className="admin-dashboard-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="admin-dashboard-content">
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'hotels' && renderHotels()}
          {activeTab === 'rooms' && renderRooms()}
        </div>
        
        {renderEditForm()}
      </div>
    </div>
  );

  return createPortal(modalContent, modalRoot);
};

export default AdminDashboard;