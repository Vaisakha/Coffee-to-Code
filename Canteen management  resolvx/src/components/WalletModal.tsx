import React, { useState } from 'react';
import { 
  X, 
  Wallet, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp,
  CreditCard,
  History,
  Sparkles,
  Zap
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose }) => {
  const { walletBalance, walletTransactions, addWalletMoney } = useCanteen();

  const [activeTab, setActiveTab] = useState<'deposit' | 'history'>('deposit');
  const [depositMethod, setDepositMethod] = useState<'GPAY' | 'BANK'>('GPAY');
  const [amountInput, setAmountInput] = useState<string>('500');
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'DEPOSIT' | 'SPENT'>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  // Metrics
  const totalDeposited = walletTransactions
    .filter((t) => t.type === 'DEPOSIT')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = walletTransactions
    .filter((t) => t.type === 'SPENT')
    .reduce((acc, t) => acc + t.amount, 0);

  const filteredTransactions = walletTransactions.filter((t) => {
    if (historyFilter === 'ALL') return true;
    return t.type === historyFilter;
  });

  const handleAddMoney = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amountInput);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const methodName = depositMethod === 'GPAY' ? 'GPay / UPI Transfer' : 'Bank Direct Transfer';
      addWalletMoney(numericAmount, methodName);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
      }, 2000);
    }, 1000);
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
        maxWidth: '560px',
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
              background: '#EE4322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(238, 67, 34, 0.3)'
            }}>
              <Wallet size={22} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1C211D',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                BiteQ Savings Wallet
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#58615A', margin: '2px 0 0' }}>
                Instant 1-Click Pay for Canteen Orders & Smart Savings
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
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Main Balance Banner Card */}
          <div style={{
            background: 'linear-gradient(135deg, #1C211D 0%, #2D342E 100%)',
            borderRadius: '20px',
            padding: '24px',
            color: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 28px rgba(28, 33, 29, 0.25)'
          }}>
            <div style={{
              position: 'absolute',
              right: '-20px',
              top: '-20px',
              width: '120px',
              height: '120px',
              background: 'rgba(238, 67, 34, 0.18)',
              borderRadius: '50%',
              blur: '30px'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#A3B0A5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Zap size={14} color="#EE4322" /> AVAILABLE WALLET SAVINGS
                </div>
                <div style={{
                  fontSize: '2.4rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.03em',
                  marginTop: '4px'
                }}>
                  ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={14} /> Active Account
              </div>
            </div>

            {/* Savings & Spending Counter Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '14px',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(74, 222, 128, 0.15)',
                  color: '#4ADE80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowDownLeft size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#A3B0A5', fontWeight: 600 }}>Total Deposited</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4ADE80' }}>
                    +₹{totalDeposited.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(238, 67, 34, 0.2)',
                  color: '#FF7B60',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#A3B0A5', fontWeight: 600 }}>Total Spent</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#FF7B60' }}>
                    -₹{totalSpent.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            background: '#FAF7F2',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid #E8E2D6'
          }}>
            <button
              onClick={() => setActiveTab('deposit')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'deposit' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'deposit' ? '#1C211D' : '#58615A',
                fontWeight: activeTab === 'deposit' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'deposit' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <PlusCircle size={16} color={activeTab === 'deposit' ? '#EE4322' : '#8A948C'} />
              Deposit / Add Money
            </button>

            <button
              onClick={() => setActiveTab('history')}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'history' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'history' ? '#1C211D' : '#58615A',
                fontWeight: activeTab === 'history' ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: activeTab === 'history' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <History size={16} color={activeTab === 'history' ? '#EE4322' : '#8A948C'} />
              Transaction History
            </button>
          </div>

          {/* TAB 1: DEPOSIT MONEY */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleAddMoney} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Payment Method Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1C211D', marginBottom: '8px' }}>
                  Select Transfer Method:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={() => setDepositMethod('GPAY')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: depositMethod === 'GPAY' ? '2px solid #EE4322' : '1px solid #E8E2D6',
                      background: depositMethod === 'GPAY' ? '#FFF9F6' : '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#E8F0FE',
                      color: '#1A73E8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1C211D' }}>GPay / UPI</div>
                      <div style={{ fontSize: '0.74rem', color: '#58615A' }}>Instant App Transfer</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositMethod('BANK')}
                    style={{
                      padding: '14px',
                      borderRadius: '14px',
                      border: depositMethod === 'BANK' ? '2px solid #EE4322' : '1px solid #E8E2D6',
                      background: depositMethod === 'BANK' ? '#FFF9F6' : '#FFFFFF',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: '#E6F4EA',
                      color: '#137333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1C211D' }}>Bank Transfer</div>
                      <div style={{ fontSize: '0.74rem', color: '#58615A' }}>NetBanking / NEFT</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#1C211D', marginBottom: '8px' }}>
                  Deposit Amount (₹):
                </label>
                
                <div style={{ position: 'relative', marginBottom: '10px' }}>
                  <span style={{
                    position: 'absolute',
                    left: '16px',
                    top: '12px',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#EE4322'
                  }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="10"
                    placeholder="Enter deposit amount"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #EE4322',
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#1C211D',
                      outline: 'none',
                      background: '#FFF9F6'
                    }}
                  />
                </div>

                {/* Quick Add Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['100', '200', '500', '1000'].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmountInput(val)}
                      style={{
                        padding: '8px',
                        borderRadius: '10px',
                        border: amountInput === val ? '1px solid #EE4322' : '1px solid #E8E2D6',
                        background: amountInput === val ? '#EE4322' : '#FFFFFF',
                        color: amountInput === val ? '#FFFFFF' : '#58615A',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer'
                      }}
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transfer Details Details Box */}
              {depositMethod === 'GPAY' ? (
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '0.82rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Smartphone size={24} color="#1A73E8" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>GPay VPA / UPI ID</div>
                    <div style={{ fontFamily: 'monospace', color: '#2563EB', fontWeight: 600 }}>biteq.canteen@okicici</div>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  fontSize: '0.82rem',
                  color: '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Building2 size={24} color="#137333" />
                  <div>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>Canteen Bank Account</div>
                    <div style={{ fontFamily: 'monospace', color: '#059669', fontWeight: 600 }}>
                      A/C: 9876 5432 1099 | IFSC: ICIC0001042
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {successMsg ? (
                <div style={{
                  background: '#E6F4EA',
                  color: '#137333',
                  padding: '14px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={20} /> Deposit Successfully Added to Wallet!
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isProcessing}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    border: 'none',
                    background: '#EE4322',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: isProcessing ? 'wait' : 'pointer',
                    boxShadow: '0 4px 16px rgba(238, 67, 34, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {isProcessing ? (
                    'Processing Deposit...'
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Deposit ₹{amountInput || '0'} to BiteQ Wallet
                    </>
                  )}
                </button>
              )}
            </form>
          )}

          {/* TAB 2: TRANSACTION HISTORY */}
          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* History Filter Pills */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['ALL', 'DEPOSIT', 'SPENT'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setHistoryFilter(filter)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '999px',
                      border: historyFilter === filter ? '1px solid #1C211D' : '1px solid #E8E2D6',
                      background: historyFilter === filter ? '#1C211D' : '#FFFFFF',
                      color: historyFilter === filter ? '#FFFFFF' : '#58615A',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {filter === 'ALL' ? 'All Activity' : filter === 'DEPOSIT' ? 'Deposits (+)' : 'Spent (-)'}
                  </button>
                ))}
              </div>

              {/* Transactions List */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '280px',
                overflowY: 'auto'
              }}>
                {filteredTransactions.length === 0 ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#8A948C', fontSize: '0.85rem' }}>
                    No transaction activity recorded yet.
                  </div>
                ) : (
                  filteredTransactions.map((tx) => {
                    const isDeposit = tx.type === 'DEPOSIT';
                    return (
                      <div
                        key={tx.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '14px 16px',
                          background: '#FAF7F2',
                          borderRadius: '14px',
                          border: '1px solid #E8E2D6'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            background: isDeposit ? '#E6F4EA' : '#FFEFEA',
                            color: isDeposit ? '#137333' : '#EE4322',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {isDeposit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                          </div>

                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1C211D' }}>
                              {tx.description}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#58615A', display: 'flex', gap: '8px' }}>
                              <span>{tx.date}</span>
                              {tx.method && <span>• {tx.method}</span>}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          fontSize: '1rem',
                          fontWeight: 900,
                          color: isDeposit ? '#137333' : '#EE4322'
                        }}>
                          {isDeposit ? '+' : '-'}₹{tx.amount}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
