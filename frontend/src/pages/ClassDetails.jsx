import { useState } from 'react';
import { ArrowLeft, Play, Clock, Zap, Users, Share2, Check } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TrainerCard,
  Modal,
  Toast,
  BottomNav,
  StatusBadge,
} from '../components';
import { mockClasses } from '../data/mockData';

export default function ClassDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const classData = mockClasses.find((c) => c.id === id) || mockClasses[0];

  const handleBook = () => {
    setShowModal(false);
    setToast({
      message: '✓ Booking confirmed!',
      type: 'success',
      visible: true,
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-navy pb-20">
      {/* Hero Image */}
      <div className="relative aspect-video bg-navy-light overflow-hidden">
        <img src={classData.image} alt={classData.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="w-16 h-16 bg-cyan rounded-full flex items-center justify-center hover:bg-cyan-light transition-colors shadow-premium">
            <Play size={32} className="text-navy-dark ml-1" fill="currentColor" />
          </button>
        </div>

        {/* Header Buttons */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-navy-dark bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <button className="absolute top-4 right-4 w-10 h-10 bg-navy-dark bg-opacity-80 rounded-full flex items-center justify-center hover:bg-opacity-100">
          <Share2 size={20} className="text-white" />
        </button>
      </div>

      {/* Content Sheet */}
      <div className="bg-navy-dark rounded-t-3xl -mt-6 relative z-10 px-4 py-6">
        {/* Title & Status */}
        <div className="mb-4">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-white flex-1">{classData.title}</h1>
            <StatusBadge status={classData.status} />
          </div>
          <p className="text-gray-400">{classData.description}</p>
        </div>

        {/* Stats Pills */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-navy rounded-xl p-3">
            <Clock size={16} className="text-cyan mb-2" />
            <p className="text-xs text-gray-400">Duration</p>
            <p className="font-bold text-white">{classData.duration}m</p>
          </div>
          <div className="bg-navy rounded-xl p-3">
            <Zap size={16} className="text-cyan mb-2" />
            <p className="text-xs text-gray-400">Credits</p>
            <p className="font-bold text-white">{classData.creditsRequired}</p>
          </div>
          <div className="bg-navy rounded-xl p-3">
            <Users size={16} className="text-cyan mb-2" />
            <p className="text-xs text-gray-400">Spots Left</p>
            <p className="font-bold text-white">{classData.remainingSlots}</p>
          </div>
        </div>

        {/* Info Section */}
        <div className="mb-6 pb-6 border-b border-navy-light">
          <h2 className="text-lg font-bold text-white mb-3">Class Info</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date & Time</span>
              <span className="text-white font-semibold">{classData.date} at {classData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Difficulty</span>
              <span className="text-white font-semibold capitalize">{classData.difficulty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category</span>
              <span className="text-white font-semibold capitalize">{classData.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Participants</span>
              <span className="text-white font-semibold">{classData.maxSlots}</span>
            </div>
          </div>
        </div>

        {/* Trainer Card */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-3">Your Instructor</h2>
          <TrainerCard trainer={classData.provider} />
        </div>

        {/* Book Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-cyan text-navy-dark font-bold py-4 rounded-xl hover:bg-cyan-light transition-colors"
        >
          Book Class Now
        </button>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showModal}
        title="Confirm Booking"
        onClose={() => setShowModal(false)}
        primaryAction={handleBook}
        primaryLabel="Confirm & Book"
      >
        <div className="space-y-4">
          <p className="text-gray-300">You're about to book:</p>
          <div className="bg-navy rounded-xl p-4">
            <h3 className="font-bold text-white mb-3">{classData.title}</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Date & Time</span>
                <span className="text-white">{classData.date} at {classData.time}</span>
              </div>
              <div className="flex justify-between">
                <span>Instructor</span>
                <span className="text-white">{classData.provider.name}</span>
              </div>
              <div className="flex justify-between border-t border-navy-light pt-2 mt-2">
                <span className="font-semibold">Credits Required</span>
                <span className="text-cyan font-bold">{classData.creditsRequired}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Toast message={toast?.message} type={toast?.type} isVisible={toast?.visible} />
      <BottomNav />
    </div>
  );
}
