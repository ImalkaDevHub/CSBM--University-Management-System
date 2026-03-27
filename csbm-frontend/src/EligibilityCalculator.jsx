import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Calculator, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApplyFlow } from './hooks/useApplyFlow';

const EligibilityCalculator = () => {
  const { handleApplyNow } = useApplyFlow();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [stream, setStream] = useState('');
  const [passes, setPasses] = useState('');
  const [result, setResult] = useState(null); // 'eligible', 'not-eligible', or null

  useEffect(() => {
    // Mock data for immediate visual feedback since backend might not be running
    // In production, use the axios call
    const mockCourses = [
      { id: 1, name: 'BSc in Computer Science', minALPasses: 3, streamReq: 'Maths' },
      { id: 2, name: 'BSc in Business Management', minALPasses: 2, streamReq: 'Commerce' },
      { id: 3, name: 'Diploma in English', minALPasses: 1, streamReq: 'Any' }
    ];
    setCourses(mockCourses);

    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/courses/all');
        if (response.data && response.data.length > 0) setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const checkEligibility = () => {
    if (!selectedCourseId || !stream || !passes) {
      // Shake animation or error state could go here
      return;
    }

    const course = courses.find(c => c.id == selectedCourseId); // loose equality for string/number id
    if (!course) return;

    // Default Logic
    const requiredPasses = course.minALPasses || 3;
    const requiredStream = course.streamReq || "Any";

    const isStreamValid = requiredStream === "Any" || requiredStream === stream;
    const isPassesValid = parseInt(passes) >= requiredPasses;

    if (isStreamValid && isPassesValid) {
      setResult('eligible');
    } else {
      setResult('not-eligible');
    }
  };

  return (
    <div className="text-white">
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        {/* 1. Course Selection */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Select Program used</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={selectedCourseId}
              onChange={(e) => { setSelectedCourseId(e.target.value); setResult(null); }}
            >
              <option value="" disabled>Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id} className="bg-slate-800 text-white">
                  {c.courseName || c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 2. Stream Selection */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">A/L Stream</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={stream}
              onChange={(e) => { setStream(e.target.value); setResult(null); }}
            >
              <option value="" disabled>Select Stream...</option>
              <option value="Maths" className="bg-slate-800">Physical Science (Maths)</option>
              <option value="Bio" className="bg-slate-800">Biological Science</option>
              <option value="Commerce" className="bg-slate-800">Commerce</option>
              <option value="Arts" className="bg-slate-800">Arts</option>
              <option value="Tech" className="bg-slate-800">Technology</option>
              <option value="Any" className="bg-slate-800">Other / Any</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 3. Results Selection */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-slate-300 mb-2">Results (Passes)</label>
          <div className="relative">
            <select
              className="w-full appearance-none bg-slate-800/50 border border-slate-600 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              value={passes}
              onChange={(e) => { setPasses(e.target.value); setResult(null); }}
            >
              <option value="" disabled>Number of Passes...</option>
              <option value="3" className="bg-slate-800">3 Passes (S/C/B/A)</option>
              <option value="2" className="bg-slate-800">2 Passes</option>
              <option value="1" className="bg-slate-800">1 Pass</option>
              <option value="0" className="bg-slate-800">0 Passes</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* 4. Action Button */}
        <div className="md:col-span-1">
          <button
            onClick={checkEligibility}
            disabled={!selectedCourseId || !stream || !passes}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Calculator className="w-5 h-5" />
            Check Status
          </button>
        </div>
      </div>

      {/* Result Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-xl border flex items-center gap-4 ${result === 'eligible'
              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100'
              : 'bg-red-500/10 border-red-500/50 text-red-100'
            }`}
        >
          {result === 'eligible' ? (
            <>
              <div className="p-2 bg-emerald-500/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-400 text-lg">You are Eligible!</h4>
                <p className="text-sm opacity-90">Your qualifications meet the entry requirements for this program.</p>
              </div>
              <button onClick={() => handleApplyNow(`?courseId=${selectedCourseId}`)} className="ml-auto bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center">
                Apply Now
              </button>
            </>
          ) : (
            <>
              <div className="p-2 bg-red-500/20 rounded-full">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-bold text-red-400 text-lg">requirements Not Met</h4>
                <p className="text-sm opacity-90">Please check the specific stream or pass requirements for this course.</p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EligibilityCalculator;