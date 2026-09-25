import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Building, 
  Phone, 
  FileText,
  Compass
} from 'lucide-react';

interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryModal: React.FC<DeliveryModalProps> = ({ isOpen, onClose }) => {
  const [tracing, setTracing] = useState(false);
  const [tracedLocation, setTracedLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleTraceLocation = () => {
    setTracing(true);
    setErrorMsg(null);
    setIsSaved(false);

    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      setTracing(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);

        let formattedAddress = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;

        try {
          // Reverse geocoding via Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              formattedAddress = data.display_name;
            }
          }
        } catch (e) {
          console.error('Failed to reverse geocode location:', e);
        }

        setTracedLocation({
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          address: formattedAddress,
        });
        setTracing(false);
      },
      (err) => {
        setTracing(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setErrorMsg('Location permission denied. Please allow access to trace delivery location.');
            break;
          case err.POSITION_UNAVAILABLE:
            setErrorMsg('Location information unavailable. Try again.');
            break;
          case err.TIMEOUT:
            setErrorMsg('Location request timed out. Try again.');
            break;
          default:
            setErrorMsg('Failed to trace location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  const handleConfirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(28, 33, 29, 0.65)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
        border: '1px solid #E8E2D6',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid #F0ECE1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
          borderRadius: '24px 24px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#FFEFEA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#EE4322'
            }}>
              <Truck size={22} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1C211D',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                Campus Express Delivery
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#58615A', margin: '2px 0 0' }}>
                Trace your live location for direct campus delivery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F4EFE6',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#58615A'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px' }}>
          {isSaved ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#E6F4EA',
                color: '#137333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={36} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1C211D', margin: 0 }}>
                Delivery Location Set!
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#58615A', margin: 0, maxWidth: '340px' }}>
                Your order will be delivered to your traced GPS location. Est. delivery time: <strong>15-20 mins</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmDelivery} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* GPS Trace Box */}
              <div style={{
                border: '1.5px dashed #EE4322',
                borderRadius: '16px',
                padding: '20px',
                background: '#FFF9F6',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EE4322' }}>
                  <Compass size={20} className={tracing ? 'spin' : ''} />
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>GPS Location Tracing</span>
                </div>

                <p style={{ fontSize: '0.84rem', color: '#58615A', margin: 0, lineHeight: 1.4 }}>
                  Press the button below to auto-detect your exact location on campus using your device GPS.
                </p>

                <button
                  type="button"
                  onClick={handleTraceLocation}
                  disabled={tracing}
                  style={{
                    background: '#EE4322',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '11px 22px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: tracing ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(238, 67, 34, 0.25)'
                  }}
                >
                  {tracing ? (
                    <>
                      <Loader2 size={16} className="spin" />
                      Tracing GPS Location...
                    </>
                  ) : (
                    <>
                      <Navigation size={16} />
                      Trace My Location Now
                    </>
                  )}
                </button>

                {/* Error Banner */}
                {errorMsg && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#D93025',
                    fontSize: '0.82rem',
                    background: '#FCE8E6',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    marginTop: '4px'
                  }}>
                    <AlertCircle size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Traced Result */}
                {tracedLocation && (
                  <div style={{
                    width: '100%',
                    background: '#FFFFFF',
                    border: '1px solid #E8E2D6',
                    borderRadius: '12px',
                    padding: '14px',
                    textAlign: 'left',
                    marginTop: '6px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '6px'
                    }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#137333',
                        background: '#E6F4EA',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <CheckCircle size={12} /> Location Traced
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#8A948C', fontWeight: 600 }}>
                        Accuracy: ±{tracedLocation.accuracy}m
                      </span>
                    </div>

                    <div style={{
                      fontSize: '0.86rem',
                      fontWeight: 700,
                      color: '#1C211D',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                      wordBreak: 'break-word'
                    }}>
                      <MapPin size={16} color="#EE4322" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{tracedLocation.address}</span>
                    </div>

                    <div style={{
                      fontSize: '0.74rem',
                      color: '#58615A',
                      marginTop: '6px',
                      fontFamily: 'monospace'
                    }}>
                      GPS: {tracedLocation.latitude.toFixed(6)}, {tracedLocation.longitude.toFixed(6)}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Details Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C211D', margin: 0 }}>
                  Campus Spot Details
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#58615A', marginBottom: '4px' }}>
                      Building / Hostel
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A948C' }} />
                      <input
                        type="text"
                        placeholder="e.g. Block B, Library"
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '10px',
                          border: '1px solid #E8E2D6',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#58615A', marginBottom: '4px' }}>
                      Room / Bench / Lab
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Room 304 / Bench 2"
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #E8E2D6',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#58615A', marginBottom: '4px' }}>
                    Contact Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A948C' }} />
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '10px',
                        border: '1px solid #E8E2D6',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#58615A', marginBottom: '4px' }}>
                    Delivery Instructions (Optional)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FileText size={15} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A948C' }} />
                    <input
                      type="text"
                      placeholder="e.g. Leave near entrance, call upon arrival"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '10px',
                        border: '1px solid #E8E2D6',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery ETA Alert */}
              <div style={{
                background: '#F4EFE6',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.82rem',
                color: '#1C211D'
              }}>
                <Clock size={16} color="#EE4322" />
                <span>Estimated Express Campus Delivery: <strong>15 - 20 Mins</strong></span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #E8E2D6',
                    background: '#FFFFFF',
                    fontWeight: 700,
                    color: '#58615A',
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#EE4322',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(238, 67, 34, 0.3)'
                  }}
                >
                  Confirm Delivery Location
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1.2s linear infinite;
        }
      `}</style>
    </div>
  );
};
