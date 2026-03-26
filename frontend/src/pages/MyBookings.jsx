import { useState } from 'react';
import {
  BookingCard,
  BottomNav,
  MobileHeader,
  EmptyState,
  Modal,
  Toast,
  FilterTabs,
} from '../components';
import { mockBookings } from '../data/mockData';
import { BookOpen } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const statuses = ['confirmed', 'completed', 'cancelled'];

  const filteredBookings = activeFilter
    ? bookings.filter((b) => b.status === activeFilter)
    : bookings;

  const handleCancelClick = (booking, canGetRefund) => {
    setSelectedBooking({ ...booking, canGetRefund });
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setBookings(
      bookings.map((b) =>
        b.id === selectedBooking.id
          ? {
              ...b,
              status: 'cancelled',
              cancellationType: selectedBooking.canGetRefund ? 'refund' : 'forfeit',
            }
          : b
      )
    );

    const message = selectedBooking.canGetRefund
      ? `✓ Booking cancelled. ${selectedBooking.creditsUsed} credits refunded!`
      : `✓ Booking cancelled. Credits forfeited (cancelled within 12 hours).`;

    setToast({
      message,
      type: 'info',
      visible: true,
    });

    setShowCancelModal(false);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-navy pb-24">
      <MobileHeader
        title="My Bookings"
        subtitle={`${filteredBookings.length} bookings`}
      />

      <div className="px-4 py-4 space-y-4">
        <FilterTabs
          categories={statuses}
          activeCategory={activeFilter}
          onSelect={setActiveFilter}
        />

        {filteredBookings.length === 0 ? (
          <EmptyState
            title="No bookings"
            description="Start exploring classes to make your first booking!"
            icon={BookOpen}
          />
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={handleCancelClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        title="Cancel Booking?"
        onClose={() => setShowCancelModal(false)}
        primaryAction={handleConfirmCancel}
        primaryLabel="Cancel Booking"
        secondaryLabel="Keep Booking"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <p className="text-gray-300">{selectedBooking.className}</p>
            
            <div className="bg-navy rounded-xl p-4">
              {selectedBooking.canGetRefund ? (
                <div>
                  <p className="text-sm text-green-400 font-semibold mb-2">✓ Full Refund</p>
                  <p className="text-sm text-gray-400">
                    You'll get {selectedBooking.creditsUsed} credits back since you're cancelling more than 12 hours before the class.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-red-400 font-semibold mb-2">⚠ Credits Forfeited</p>
                  <p className="text-sm text-gray-400">
                    You're cancelling within 12 hours of the class, so {selectedBooking.creditsUsed} credits will be forfeited.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Toast message={toast?.message} type={toast?.type} isVisible={toast?.visible} />
      <BottomNav />
    </div>
  );
}
