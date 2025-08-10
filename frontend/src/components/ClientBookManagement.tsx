import React, { useEffect, useState } from "react";
import { FaUsers, FaCalendarAlt, FaBed, FaCreditCard, FaBroom, FaChartBar, FaBell, FaCog, FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaDownload, FaPrint, FaEnvelope, FaPhone, FaMapMarkerAlt, FaStar, FaCheckCircle, FaExclamationTriangle, FaClock, FaUserTie, FaShieldAlt, FaGlobe, FaPalette, FaTimes } from "react-icons/fa";

interface Guest {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  preferences: string[];
  loyaltyPoints: number;
  totalStays: number;
  averageRating: number;
  lastVisit: string;
  status: 'active' | 'inactive' | 'vip';
}

interface Booking {
  _id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed';
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

interface Room {
  _id: string;
  title: string;
  type: string;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities: string[];
  images: string[];
}

interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  method: 'credit_card' | 'bank_transfer' | 'cash' | 'online';
  status: 'completed' | 'pending' | 'failed';
  transactionId: string;
  date: string;
}

interface HousekeepingTask {
  _id: string;
  roomId: string;
  type: 'daily' | 'deep_clean' | 'maintenance';
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo: string;
  scheduledDate: string;
  completedDate?: string;
  notes: string;
}

const ClientBookManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [housekeepingTasks, setHousekeepingTasks] = useState<HousekeepingTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState<'guest' | 'booking' | 'room' | 'payment' | 'housekeeping'>('guest');

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, these would be API calls
    setGuests([
      {
        _id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        address: '123 Main St, City, State',
        preferences: ['Mountain View', 'King Bed', 'Non-smoking'],
        loyaltyPoints: 1250,
        totalStays: 8,
        averageRating: 4.8,
        lastVisit: '2024-01-15',
        status: 'vip'
      },
      {
        _id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1-555-0456',
        address: '456 Oak Ave, City, State',
        preferences: ['Forest View', 'Double Bed'],
        loyaltyPoints: 750,
        totalStays: 5,
        averageRating: 4.6,
        lastVisit: '2024-01-10',
        status: 'active'
      }
    ]);

    setBookings([
      {
        _id: '1',
        guestId: '1',
        roomId: '1',
        checkIn: '2024-02-01',
        checkOut: '2024-02-05',
        guests: 2,
        totalAmount: 800,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: 'Early check-in preferred',
        createdAt: '2024-01-20',
        updatedAt: '2024-01-20'
      },
      {
        _id: '2',
        guestId: '2',
        roomId: '2',
        checkIn: '2024-02-10',
        checkOut: '2024-02-12',
        guests: 1,
        totalAmount: 300,
        status: 'pending',
        paymentStatus: 'pending',
        specialRequests: '',
        createdAt: '2024-01-21',
        updatedAt: '2024-01-21'
      }
    ]);

    setRooms([
      {
        _id: '1',
        title: 'King Bed • Mountain View',
        type: 'Deluxe',
        capacity: 2,
        price: 200,
        status: 'occupied',
        amenities: ['Mountain View', 'King Bed', 'Balcony', 'Mini Bar'],
        images: ['/himalayas-bg.jpg']
      },
      {
        _id: '2',
        title: 'Double Bed • Forest View',
        type: 'Standard',
        capacity: 2,
        price: 150,
        status: 'available',
        amenities: ['Forest View', 'Double Bed', 'Garden Access'],
        images: ['/himalayas-bg.jpg']
      }
    ]);

    setPayments([
      {
        _id: '1',
        bookingId: '1',
        amount: 800,
        method: 'credit_card',
        status: 'completed',
        transactionId: 'TXN-001-2024',
        date: '2024-01-20'
      },
      {
        _id: '2',
        bookingId: '2',
        amount: 300,
        method: 'online',
        status: 'pending',
        transactionId: 'TXN-002-2024',
        date: '2024-01-21'
      }
    ]);

    setHousekeepingTasks([
      {
        _id: '1',
        roomId: '1',
        type: 'daily',
        status: 'completed',
        assignedTo: 'Maria Garcia',
        scheduledDate: '2024-01-22',
        completedDate: '2024-01-22',
        notes: 'Room cleaned, towels replaced'
      },
      {
        _id: '2',
        roomId: '2',
        type: 'deep_clean',
        status: 'pending',
        assignedTo: 'Carlos Rodriguez',
        scheduledDate: '2024-01-23',
        notes: 'Deep cleaning required after guest departure'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
      case 'paid':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaClock className="text-yellow-600" />;
      case 'cancelled':
      case 'failed':
        return <FaExclamationTriangle className="text-red-600" />;
      case 'in_progress':
        return <FaClock className="text-blue-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Key Metrics Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Guests</p>
            <p className="text-3xl font-bold text-gray-900">{guests.length}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <FaUsers className="text-blue-600 text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">+12%</span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Bookings</p>
            <p className="text-3xl font-bold text-gray-900">{bookings.filter(b => b.status === 'confirmed').length}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <FaCalendarAlt className="text-green-600 text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">+8%</span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Revenue</p>
            <p className="text-3xl font-bold text-gray-900">${payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0)}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <FaCreditCard className="text-purple-600 text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">+15%</span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
            <p className="text-3xl font-bold text-gray-900">78%</p>
          </div>
          <div className="p-3 bg-orange-100 rounded-full">
            <FaBed className="text-orange-600 text-xl" />
          </div>
        </div>
        <div className="mt-4">
          <span className="text-sm text-green-600 font-medium">+5%</span>
          <span className="text-sm text-gray-500 ml-2">from last month</span>
        </div>
      </div>
    </div>
  );

  const renderGuests = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Guest Management</h3>
          <button
            onClick={() => {
              setModalType('guest');
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add Guest
          </button>
        </div>
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search guests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyalty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guests.map((guest) => (
              <tr key={guest._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {guest.firstName[0]}{guest.lastName[0]}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {guest.firstName} {guest.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {guest.totalStays} stays • {guest.averageRating}★
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{guest.email}</div>
                  <div className="text-sm text-gray-500">{guest.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{guest.loyaltyPoints} points</div>
                  <div className="text-sm text-gray-500">Last: {guest.lastVisit}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(guest.status)}`}>
                    {guest.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
          <button
            onClick={() => {
              setModalType('booking');
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> New Booking
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{booking._id}</div>
                  <div className="text-sm text-gray-500">{booking.guests} guests</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {guests.find(g => g._id === booking.guestId)?.firstName} {guests.find(g => g._id === booking.guestId)?.lastName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {guests.find(g => g._id === booking.guestId)?.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.checkIn}</div>
                  <div className="text-sm text-gray-500">to {booking.checkOut}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                  <div className="text-sm text-gray-500">{booking.paymentStatus}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <FaEye />
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Room Management</h3>
          <button
            onClick={() => {
              setModalType('room');
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> Add Room
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {rooms.map((room) => (
          <div key={room._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48">
              <img
                src={room.images[0] || "/himalayas-bg.jpg"}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                  {room.status.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{room.title}</h4>
              <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">${room.price}</span> / night • {room.capacity} guests
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {room.amenities.slice(0, 3).map((amenity, idx) => (
                  <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="text-xs text-gray-500">+{room.amenities.length - 3} more</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="text-blue-600 hover:text-blue-900 text-sm">
                  <FaEdit className="inline mr-1" /> Edit
                </button>
                <button className="text-green-600 hover:text-green-900 text-sm">
                  <FaEye className="inline mr-1" /> View
                </button>
                <button className="text-red-600 hover:text-red-900 text-sm">
                  <FaTrash className="inline mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Payment Processing</h3>
          <div className="flex gap-2">
            <button className="btn btn-secondary flex items-center gap-2">
              <FaDownload /> Export
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <FaPlus /> New Payment
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.transactionId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">#{payment.bookingId}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">${payment.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="capitalize text-sm text-gray-900">{payment.method.replace('_', ' ')}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(payment.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHousekeeping = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Housekeeping & Maintenance</h3>
          <button
            onClick={() => {
              setModalType('housekeeping');
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus /> New Task
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {housekeepingTasks.map((task) => (
          <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {task.type}
              </span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">
              Room {rooms.find(r => r._id === task.roomId)?.title}
            </h4>
            <div className="text-sm text-gray-600 mb-3">
              <div>Assigned to: {task.assignedTo}</div>
              <div>Scheduled: {task.scheduledDate}</div>
              {task.completedDate && <div>Completed: {task.completedDate}</div>}
            </div>
            {task.notes && (
              <div className="text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                {task.notes}
              </div>
            )}
            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:text-blue-900 text-sm">
                <FaEdit className="inline mr-1" /> Edit
              </button>
              <button className="text-green-600 hover:text-green-900 text-sm">
                <FaCheckCircle className="inline mr-1" /> Complete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analytics</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaChartBar className="text-4xl mx-auto mb-2" />
            <p>Revenue chart will be displayed here</p>
            <p className="text-sm">Integration with Chart.js or similar library</p>
          </div>
        </div>
      </div>

      {/* Occupancy Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Occupancy Trends</h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <FaBed className="text-4xl mx-auto mb-2" />
            <p>Occupancy chart will be displayed here</p>
            <p className="text-sm">Integration with Chart.js or similar library</p>
          </div>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Average Daily Rate</h4>
          <p className="text-2xl font-bold text-gray-900">$175</p>
          <span className="text-sm text-green-600">+8% from last month</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Length of Stay</h4>
          <p className="text-2xl font-bold text-gray-900">3.2 days</p>
          <span className="text-sm text-green-600">+2% from last month</span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h4>
          <p className="text-2xl font-bold text-gray-900">68%</p>
          <span className="text-sm text-green-600">+5% from last month</span>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-500">Receive alerts for new bookings and cancellations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-500">Receive SMS alerts for urgent matters</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security & Access</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <button className="btn btn-secondary">Enable</button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Session Timeout</h4>
              <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg">
              <option>30 minutes</option>
              <option>1 hour</option>
              <option>4 hours</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Branding & Customization</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaPalette className="text-gray-400" />
              </div>
              <button className="btn btn-secondary">Upload New Logo</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center gap-2">
              <input type="color" className="w-12 h-8 border border-gray-300 rounded" defaultValue="#3B82F6" />
              <span className="text-sm text-gray-500">Customize your dashboard theme</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'guests':
        return renderGuests();
      case 'bookings':
        return renderBookings();
      case 'rooms':
        return renderRooms();
      case 'payments':
        return renderPayments();
      case 'housekeeping':
        return renderHousekeeping();
      case 'reports':
        return renderReports();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Client & Book Management</h1>
              <p className="text-gray-600">Comprehensive hotel management dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FaCog className="text-xl" />
              </button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <span className="text-sm font-medium text-gray-900">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: FaChartBar },
              { id: 'guests', label: 'Guest Management', icon: FaUsers },
              { id: 'bookings', label: 'Bookings', icon: FaCalendarAlt },
              { id: 'rooms', label: 'Room Management', icon: FaBed },
              { id: 'payments', label: 'Payments', icon: FaCreditCard },
              { id: 'housekeeping', label: 'Housekeeping', icon: FaBroom },
              { id: 'reports', label: 'Reports & Analytics', icon: FaChartBar },
              { id: 'settings', label: 'Settings', icon: FaCog }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {renderContent()}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {modalType === 'guest' && 'Add New Guest'}
                  {modalType === 'booking' && 'Create New Booking'}
                  {modalType === 'room' && 'Add New Room'}
                  {modalType === 'payment' && 'Process Payment'}
                  {modalType === 'housekeeping' && 'Create Housekeeping Task'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="text-center text-gray-500 py-8">
                <FaPlus className="text-4xl mx-auto mb-4" />
                <p>Form will be implemented here based on the selected type</p>
                <p className="text-sm">This would include all necessary fields and validation</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBookManagement;
