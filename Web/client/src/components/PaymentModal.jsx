import { useState, useEffect, useMemo } from 'react';
import { X, PlusCircle, MinusCircle, CreditCard, Printer, Truck, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyCanvas } from '@/components/currency/CurrencyCanvas';
import { createTransaction, generatePaymentLink } from '@/api/paymentApi';
import { toast } from 'react-hot-toast';
import PropTypes from 'prop-types';

// Helper function for CurrencyCanvas template image
function getTemplateImage(denomination) {
  const denStr = String(denomination);
  if (denStr === '200') return '/lovable-uploads/200-front-template.png';
  if (denStr === '500') return '/lovable-uploads/500-front-template.png';
  if (denStr === '1000') return '/lovable-uploads/1000-front-template.png';
  return '/lovable-uploads/200-front-template.png'; // Default
}

const PRINTING_FEE_PER_NOTE = 100;
const DELIVERY_FEE = 500;
const RECONCILIATION_FEE = 200;

export default function PaymentModal({ isOpen, onClose, eventDetails, currencies, associatedImages }) {
  const [currencyQuantities, setCurrencyQuantities] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize quantities to 0 when modal opens
      const initialQuantities = {};
      currencies.forEach(c => {
        initialQuantities[c.currency_id] = 0;
      });
      setCurrencyQuantities(initialQuantities);
      setPaymentError(null); // Reset error
    }
  }, [isOpen, currencies]);

  const handleQuantityChange = (currencyId, amount) => {
    setCurrencyQuantities(prev => ({
      ...prev,
      [currencyId]: Math.max(0, (prev[currencyId] || 0) + amount)
    }));
  };

  const handleQuantityInputChange = (currencyId, value) => {
    const numValue = parseInt(value, 10);
    setCurrencyQuantities(prev => ({
      ...prev,
      [currencyId]: Math.max(0, isNaN(numValue) ? 0 : numValue)
    }));
  };

  const totalNotes = useMemo(() => {
    return Object.values(currencyQuantities).reduce((sum, qty) => sum + qty, 0);
  }, [currencyQuantities]);

  const currencyValue = useMemo(() => {
    return currencies.reduce((sum, currency) => {
      const quantity = currencyQuantities[currency.currency_id] || 0;
      return sum + (quantity * parseInt(currency.denomination, 10));
    }, 0);
  }, [currencies, currencyQuantities]);

  const printingCost = useMemo(() => {
    return totalNotes * PRINTING_FEE_PER_NOTE;
  }, [totalNotes]);

  const totalCost = useMemo(() => {
    if (totalNotes === 0) return 0; // No cost if no notes selected
    return currencyValue + printingCost + DELIVERY_FEE + RECONCILIATION_FEE;
  }, [currencyValue, printingCost, totalNotes]);

  const handleInitiatePayment = async () => {
    if (totalCost === 0) {
      toast.error("Please select at least one currency note.");
      return;
    }
    setIsProcessingPayment(true);
    setPaymentError(null);

    const currencyDetailsForApi = {};
    currencies.forEach(c => {
        if (currencyQuantities[c.currency_id] > 0) {
            currencyDetailsForApi[String(c.denomination)] = (currencyDetailsForApi[String(c.denomination)] || 0) + currencyQuantities[c.currency_id];
        }
    });


    try {
      const transactionData = await createTransaction(eventDetails.event_id, totalCost, currencyDetailsForApi);
      toast.success("Transaction created. Generating payment link...");

      const paymentLinkData = await generatePaymentLink(transactionData.payment_reference);
      if (paymentLinkData.responseBody && paymentLinkData.responseBody.checkoutUrl) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = paymentLinkData.responseBody.checkoutUrl;
      } else {
        throw new Error(paymentLinkData.responseMessage || "Failed to get payment link.");
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setPaymentError(err.message || "Failed to initiate payment. Please try again.");
      toast.error(err.message || "Failed to initiate payment.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-sm sm:max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-3 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-bluePrimary/5 to-bluePrimary/10">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-left text-gray-900 font-playfair">Complete Payment</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Secure checkout for your currency order</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/50 h-8 w-8 sm:h-10 sm:w-10">
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Event Details */}
          <div className="p-3 sm:p-6 border-b border-gray-100 bg-gray-50">
            <div className="text-left">
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900 font-playfair mb-1 sm:mb-2">{eventDetails?.event_name}</h3>
              <p className="text-xs sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">{eventDetails?.event_description}</p>
            </div>
          </div>

          <div className="p-3 sm:p-6 space-y-4 sm:space-y-8">
            {/* Currency Selection */}
            <div>
              <h4 className="text-base sm:text-xl font-semibold text-left text-gray-900 mb-3 sm:mb-6">Select Quantities</h4>
              {currencies.length > 0 ? (
                <div className="space-y-3 sm:space-y-6">
                  {currencies.map(currency => (
                    <div key={currency.currency_id} className="bg-white border border-gray-200 sm:border-2 sm:border-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-bluePrimary/30 sm:hover:border-bluePrimary/20 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex flex-col sm:flex-col lg:flex-row items-center gap-3 sm:gap-6">
                        {/* Currency Preview */}
                        <div className="w-full max-w-[180px] sm:max-w-[240px] flex-shrink-0">
                          {associatedImages[currency.currency_id]?.front || currency.front_image ? (
                             <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-md sm:rounded-lg p-2 sm:p-4 shadow-inner">
                               <CurrencyCanvas
                                templateImage={getTemplateImage(currency.denomination)}
                                texts={{
                                  currencyName: currency.currency_name,
                                  celebration: currency.front_celebration_text,
                                  dominationText: String(currency.denomination),
                                  eventId: currency.event_id,
                                }}
                                side="front"
                                denomination={String(currency.denomination)}
                                portraitImage={associatedImages[currency.currency_id]?.front}
                              />
                             </div>
                          ) : (
                            <div className="text-center py-4 sm:py-8 text-gray-400 italic border border-dashed border-gray-200 rounded-md sm:rounded-lg bg-gray-50">
                              <FileText className="w-4 h-4 sm:w-8 sm:h-8 mx-auto mb-1 sm:mb-2 text-gray-300" />
                              <p className="text-xs sm:text-sm">No preview</p>
                            </div>
                          )}
                        </div>

                        {/* Currency Info & Controls */}
                        <div className="flex-1 w-full">
                          <div className="text-center lg:text-left mb-3 sm:mb-6">
                            <h5 className="text-sm sm:text-xl font-bold text-gray-900 mb-1">
                              {currency.currency_name || 'Unnamed Currency'}
                            </h5>
                            <div className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-bluePrimary/10 text-bluePrimary rounded-full font-semibold text-xs sm:text-sm">
                              ₦{currency.denomination}
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-center lg:justify-start gap-2 sm:gap-4">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 min-w-[50px] sm:min-w-[60px]">Qty:</span>
                            <div className="flex items-center gap-1 sm:gap-3 bg-gray-50 rounded-md sm:rounded-lg p-1 sm:p-2">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleQuantityChange(currency.currency_id, -1)} 
                                disabled={(currencyQuantities[currency.currency_id] || 0) === 0} 
                                className="h-7 w-7 sm:h-10 sm:w-10 hover:bg-red-50 hover:border-red-200"
                              >
                                <MinusCircle className="w-3 h-3 sm:w-5 sm:h-5 text-red-500" />
                              </Button>
                              
                              <input
                                type="number"
                                min="0"
                                value={currencyQuantities[currency.currency_id] || 0}
                                onChange={(e) => handleQuantityInputChange(currency.currency_id, e.target.value)}
                                className="w-12 h-7 sm:w-20 sm:h-10 text-center border-gray-300 rounded text-sm sm:text-lg font-semibold focus:border-bluePrimary focus:ring-bluePrimary"
                              />
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => handleQuantityChange(currency.currency_id, 1)} 
                                className="h-7 w-7 sm:h-10 sm:w-10 hover:bg-green-50 hover:border-green-200"
                              >
                                <PlusCircle className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" />
                              </Button>
                            </div>
                            
                            {(currencyQuantities[currency.currency_id] || 0) > 0 && (
                              <div className="text-right">
                                <p className="text-xs text-gray-600">Subtotal</p>
                                <p className="font-bold text-sm sm:text-lg text-bluePrimary">
                                  ₦{((currencyQuantities[currency.currency_id] || 0) * parseInt(currency.denomination, 10)).toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <CreditCard className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-lg">No currencies available</p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {paymentError && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-3 sm:p-4 shadow-sm">
                <div className="flex items-start">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 mr-2 sm:mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-semibold text-red-800 text-sm sm:text-base">Payment Error</h5>
                    <p className="text-xs sm:text-sm text-red-700 mt-1">{paymentError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Breakdown */}
            <div className="bg-gradient-to-br from-bluePrimary/5 to-bluePrimary/10 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-bluePrimary/20 shadow-sm">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-bluePrimary" /> 
                Payment Summary
              </h4>
              
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-bluePrimary/20">
                  <span className="text-gray-700 font-medium text-sm sm:text-base">Currency Value</span>
                  <span className="font-bold text-sm sm:text-lg text-gray-900">₦{currencyValue.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-bluePrimary/20">
                  <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
                    <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"/>
                    Printing ({totalNotes} notes)
                  </span>
                  <span className="font-bold text-sm sm:text-lg text-gray-900">₦{printingCost.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-bluePrimary/20">
                  <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
                    <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"/>
                    Delivery
                  </span>
                  <span className="font-bold text-sm sm:text-lg text-gray-900">₦{DELIVERY_FEE.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-1 sm:py-2 border-b border-bluePrimary/20">
                  <span className="text-gray-700 font-medium flex items-center text-sm sm:text-base">
                    <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-gray-500"/>
                    Reconciliation
                  </span>
                  <span className="font-bold text-sm sm:text-lg text-gray-900">₦{RECONCILIATION_FEE.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center pt-2 sm:pt-4 mt-2 sm:mt-4 border-t-2 border-bluePrimary/30">
                  <span className="text-base sm:text-xl font-bold text-gray-900">Total</span>
                  <span className="text-lg sm:text-2xl font-bold text-bluePrimary">₦{totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {totalNotes > 0 ? (
                <span>Ready: <strong className="text-bluePrimary">{totalNotes}</strong> notes</span>
              ) : (
                <span>Select quantities to continue</span>
              )}
            </div>
            
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={onClose} 
                disabled={isProcessingPayment}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInitiatePayment}
                disabled={isProcessingPayment || totalNotes === 0}
                className="flex-1 sm:flex-none bg-bluePrimary hover:bg-bluePrimary/90 text-white px-4 sm:px-8 py-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
              >
                {isProcessingPayment ? (
                  <span className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Processing...</span>
                    <span className="sm:hidden">...</span>
                  </span>
                ) : (
                  `Pay ₦${totalCost.toLocaleString()}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

PaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  eventDetails: PropTypes.shape({
    event_id: PropTypes.string.isRequired,
    event_name: PropTypes.string.isRequired,
    event_description: PropTypes.string,
  }).isRequired,
  currencies: PropTypes.arrayOf(
    PropTypes.shape({
      currency_id: PropTypes.string.isRequired,
      currency_name: PropTypes.string,
      denomination: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      event_id: PropTypes.string.isRequired,
      front_celebration_text: PropTypes.string,
      front_image: PropTypes.string,
    })
  ).isRequired,
  associatedImages: PropTypes.object.isRequired,
}; 