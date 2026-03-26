import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Toast } from '../components';

export default function CreateClass() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 60,
    maxSlots: 20,
    creditsRequired: 5,
    category: 'yoga',
    difficulty: 'intermediate',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setToast({
      message: '✓ Class created successfully!',
      type: 'success',
      visible: true,
    });
    setTimeout(() => {
      setToast(null);
      navigate('/provider-dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-navy pb-8">
      {/* Header */}
      <div className="bg-navy-dark px-4 pt-4 pb-4 border-b border-navy-light flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-navy-light rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-white" />
        </button>
        <h1 className="text-2xl font-bold text-white">Create Class</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Class Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Morning Yoga Flow"
            className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Time *</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Max Participants</label>
            <input
              type="number"
              name="maxSlots"
              value={formData.maxSlots}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Credits Required</label>
            <input
              type="number"
              name="creditsRequired"
              value={formData.creditsRequired}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan"
          >
            <option value="yoga">Yoga</option>
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="recovery">Recovery</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your class..."
            rows="4"
            className="w-full bg-navy-light border border-navy-light rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan text-navy-dark font-bold py-4 rounded-xl hover:bg-cyan-light transition-colors flex items-center justify-center gap-2 mt-6"
        >
          <Save size={20} />
          Create Class
        </button>
      </form>

      <Toast message={toast?.message} type={toast?.type} isVisible={toast?.visible} />
    </div>
  );
}
