import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookings } from "../redux/slices/bookingSlice";
import { AppDispatch, RootState } from "../redux/store";

const Bookings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.bookings
  );

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <h2>Recent Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.guestName} -{" "}
            {new Date(booking.checkIn).toLocaleDateString()} to{" "}
            {new Date(booking.checkOut).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
