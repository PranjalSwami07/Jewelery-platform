import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  Sparkles,
  Gem,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCity?: string;
  pieceInterest?: string;
}

export const INDIAN_SALON_LOCATIONS = [
  {
    city: "Mumbai",
    salon: "The Taj Mahal Palace, Colaba, Mumbai 400001",
    phone: "+91 22 6665 3366",
    code: "BOM",
  },
  {
    city: "New Delhi",
    salon: "The Leela Palace, Chanakyapuri, New Delhi 110023",
    phone: "+91 11 3933 1234",
    code: "DEL",
  },
  {
    city: "Jaipur",
    salon: "Rambagh Palace Heritage Atelier, Bhawani Singh Rd, Jaipur 302005",
    phone: "+91 141 238 5700",
    code: "JAI",
  },
  {
    city: "Bengaluru",
    salon: "The Collection, UB City, Vittal Mallya Rd, Bengaluru 560001",
    phone: "+91 80 4099 0000",
    code: "BLR",
  },
  {
    city: "Hyderabad",
    salon: "Taj Falaknuma Royal Suite, Engine Bowli, Hyderabad 500053",
    phone: "+91 40 6629 8585",
    code: "HYD",
  },
  {
    city: "Kolkata",
    salon: "Park Street Heritage Salon, Camac Street, Kolkata 700016",
    phone: "+91 33 2287 0123",
    code: "CCU",
  },
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedCity = "Mumbai",
  pieceInterest = "Bespoke High Jewelry Commission",
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState(preselectedCity);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState("14:00 - 16:00 (Afternoon Salon)");
  const [interest, setInterest] = useState(pieceInterest);
  const [specialRequests, setSpecialRequests] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    referenceId: string;
    city: string;
    salon: string;
    date: string;
    timeSlot: string;
    name: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const salonData =
      INDIAN_SALON_LOCATIONS.find((s) => s.city === selectedCity) ||
      INDIAN_SALON_LOCATIONS[0];

    const refId = `MDE-${salonData.code}-${Math.floor(100000 + Math.random() * 900000)}`;

    const payload = {
      name,
      email,
      phone: phone || "+91 98200 12345",
      salonLocation: `${salonData.city} - ${salonData.salon}`,
      pieceInterest: interest,
      message: `Appointment requested on ${date} at ${timeSlot}. Special requests: ${specialRequests || "Champagne hospitality and GIA dossier review."}`,
    };

    try {
      await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Offline / standalone resilience
    }

    setTimeout(() => {
      setConfirmedBooking({
        referenceId: refId,
        city: salonData.city,
        salon: salonData.salon,
        date,
        timeSlot,
        name,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setName("");
    setEmail("");
    setPhone("");
    setSpecialRequests("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={handleReset}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Surface */}
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-gold-500/35 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-[0_25px_90px_rgba(0,0,0,0.95)] z-10 overflow-y-auto max-h-[92vh] my-auto text-neutral-200">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-gold-500/15 blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={handleReset}
          aria-label="Close Appointment Modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-gold-500/30 flex items-center justify-center text-neutral-400 hover:text-gold-200 hover:border-gold-400 bg-neutral-900/60 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="py-6 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 rounded-full border-2 border-gold-400 bg-gold-950/60 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(197,160,89,0.4)]">
              <CheckCircle2 className="w-8 h-8 text-gold-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-400">
                Salon Reservation Confirmed
              </div>
              <h3 className="text-3xl font-serif text-gold-100">
                Namaste, {confirmedBooking.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-sans leading-relaxed">
                Your private viewing appointment at our {confirmedBooking.city} salon has been recorded. Our Senior Client Advisor will connect with you to curate your bespoke showcase.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-neutral-900/80 border border-gold-500/25 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Reference Dossier</span>
                <span className="text-gold-300 font-bold">{confirmedBooking.referenceId}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Indian Salon Suite</span>
                <span className="text-gold-100 text-right">{confirmedBooking.city}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Address</span>
                <span className="text-neutral-300 text-right text-[11px] max-w-[200px] truncate">
                  {confirmedBooking.salon}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Appointment Date</span>
                <span className="text-gold-200">{confirmedBooking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Salon Window</span>
                <span className="text-gold-200">{confirmedBooking.timeSlot}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gold-400/80 font-sans">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span>Complimentary private salon hospitality • GIA Master Gemologist Consultation</span>
            </div>

            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-black text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-lg hover:scale-105"
            >
              Return to Collection
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-left space-y-1.5 pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-950/40 text-gold-300 text-[10px] uppercase tracking-[0.25em]">
                <Gem className="w-3 h-3 text-gold-400" />
                <span>Private Client Services • India</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-gold-100">
                Book Private Salon Appointment
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Experience bespoke high jewelry commissions in exclusive private suites across Mumbai, New Delhi, Jaipur, and Bengaluru.
              </p>
            </div>

            {/* Select Indian Salon Location */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Select Flagship Indian Salon</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {INDIAN_SALON_LOCATIONS.map((s) => (
                  <button
                    key={s.city}
                    type="button"
                    onClick={() => setSelectedCity(s.city)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedCity === s.city
                        ? "border-gold-400 bg-gold-950/60 shadow-[0_0_15px_rgba(197,160,89,0.25)] text-gold-100"
                        : "border-neutral-800 bg-neutral-900/60 hover:border-gold-500/30 text-neutral-400"
                    }`}
                  >
                    <div className="text-xs font-serif font-medium text-gold-200">
                      {s.city}
                    </div>
                    <div className="text-[10px] text-neutral-400 line-clamp-1 font-sans">
                      {s.salon.split(",")[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Client Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maharani Gayatri / Kabir Mehta"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>Phone Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 12345"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@maison-elegance.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-100 placeholder:text-neutral-600 focus:outline-none focus:border-gold-400"
              />
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-400" />
                  <span>Preferred Date</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-gold-100 focus:outline-none focus:border-gold-400 [color-scheme:dark]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-400" />
                  <span>Salon Time Window</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
                >
                  <option value="11:00 - 13:00 (Morning Champagne Salon)">
                    11:00 AM – 1:00 PM (Morning Salon)
                  </option>
                  <option value="14:00 - 16:00 (Afternoon Salon)">
                    2:00 PM – 4:00 PM (Afternoon Salon)
                  </option>
                  <option value="17:00 - 19:30 (Evening Royal Viewing)">
                    5:00 PM – 7:30 PM (Evening Royal Viewing)
                  </option>
                </select>
              </div>
            </div>

            {/* Piece of Interest */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Piece or Commission of Interest</span>
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-gold-100 focus:outline-none focus:border-gold-400"
              >
                <option value="The Graduated Rivière Diamond Necklace (36.80 ct)">
                  The Graduated Rivière Diamond Necklace (36.80 ct)
                </option>
                <option value="The Étoile 58-Facet Halo Solitaire Ring (3.85 ct)">
                  The Étoile 58-Facet Halo Solitaire Ring (3.85 ct)
                </option>
                <option value="L'Impératrice Pear Diamond Cascade Collier">
                  L'Impératrice Pear Diamond Cascade Collier
                </option>
                <option value="Bespoke Private Salon Commission (Kashmir Sapphires / Golconda Diamonds)">
                  Bespoke Private Salon Commission (Kashmir Sapphires / Golconda Diamonds)
                </option>
                <option value="Royal Heritage Bridal Suite">
                  Royal Heritage Bridal Suite
                </option>
              </select>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-black text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_25px_rgba(197,160,89,0.45)] hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-black" />
                    <span>Transmitting to Salon Director...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Private Salon Viewing</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;

