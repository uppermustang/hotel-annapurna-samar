import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReports } from "../redux/slices/bookingSlice";
import { AppDispatch, RootState } from "../redux/store";

const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reports, loading, error } = useSelector(
    (state: RootState) => state.bookings
  );

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-deep-blue">
        Reports Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow card-shadow">
          <h3 className="text-lg font-semibold text-gray-600">
            Total Bookings
          </h3>
          <p className="text-3xl font-bold text-vibrant-pink">
            {reports.totalBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow card-shadow">
          <h3 className="text-lg font-semibold text-gray-600">
            Active Bookings
          </h3>
          <p className="text-3xl font-bold text-forest-green">
            {reports.activeBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow card-shadow">
          <h3 className="text-lg font-semibold text-gray-600">
            Pending Bookings
          </h3>
          <p className="text-3xl font-bold text-warm-red">
            {reports.pendingBookings}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow card-shadow">
          <h3 className="text-lg font-semibold text-gray-600">
            Completed Bookings
          </h3>
          <p className="text-3xl font-bold text-deep-blue">
            {reports.completedBookings}
          </p>
        </div>
      </div>

      {reports.recentBookings && reports.recentBookings.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow card-shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">Recent Bookings</h3>
          <div className="space-y-2">
            {reports.recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>{booking.guestName}</span>
                <span className="text-sm text-gray-500">
                  {booking.roomType}
                </span>
                <span
                  className={`px-2 py-1 rounded text-sm ${
                    booking.status === "active"
                      ? "bg-green-100 text-green-800"
                      : booking.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {reports.roomTypeStats && reports.roomTypeStats.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow card-shadow">
          <h3 className="text-lg font-semibold mb-3">Bookings by Room Type</h3>
          <div className="space-y-2">
            {reports.roomTypeStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{stat._id || "Unknown"}</span>
                <span className="font-semibold">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
