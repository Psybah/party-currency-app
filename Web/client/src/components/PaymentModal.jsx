import React, { useState, useEffect, useMemo } from 'react';
import { X, PlusCircle, MinusCircle, CreditCard, Printer, Truck, FileText, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CurrencyCanvas } from '@/components/currency/CurrencyCanvas';
import { createTransaction, generatePaymentLink } from '@/api/paymentApi'; // Assuming this is the correct path
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Helper function for CurrencyCanvas template image (can be imported if shared)
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
  const navigate = useNavigate();
  const [currencyQuantities, setCurrencyQuantities] = useState({});
  const [paymentReference, setPaymentReference] = useState(null);
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
      setPaymentReference(null); // Reset payment reference
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
      setPaymentReference(transactionData.payment_reference);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Complete Your Payment</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 font-playfair mb-1">{eventDetails?.event_name}</h3>
            <p className="text-gray-600 text-sm">{eventDetails?.event_description}</p>
          </div>

          <h4 className="text-lg font-semibold text-gray-700 mb-3">Select Currency Quantities:</h4>
          {currencies.length > 0 ? (
            <div className="space-y-4 mb-6">
              {currencies.map(currency => (
                <div key={currency.currency_id} className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-1/3">
                    {associatedImages[currency.currency_id]?.front || currency.front_image ? (
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
                    ) : <div className="text-center py-4 text-xs text-gray-400 italic border rounded-md h-full flex items-center justify-center">No front image</div>}
                  </div>
                  <div className="w-full sm:w-2/3">
                    <p className="font-semibold text-gray-700">{currency.currency_name || 'Unnamed Currency'} - ₦{currency.denomination}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(currency.currency_id, -1)} disabled={currencyQuantities[currency.currency_id] === 0}>
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                      <input
                        type="number"
                        min="0"
                        value={currencyQuantities[currency.currency_id] || 0}
                        onChange={(e) => handleQuantityInputChange(currency.currency_id, e.target.value)}
                        className="w-16 text-center border-gray-300 rounded-md shadow-sm focus:border-bluePrimary focus:ring-bluePrimary"
                      />
                      <Button variant="outline" size="icon" onClick={() => handleQuantityChange(currency.currency_id, 1)}>
                        <PlusCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No currencies available for this event.</p>
          )}

          {paymentError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                <p className="font-bold">Payment Error</p>
              </div>
              <p className="text-sm ml-7">{paymentError}</p>
            </div>
          )}

          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-bluePrimary" /> Cost Breakdown
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Currency Value:</span>
                <span className="font-medium text-gray-800">₦{currencyValue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center"><Printer className="w-4 h-4 mr-1.5 text-gray-500"/>Printing Fee ({totalNotes} notes x ₦{PRINTING_FEE_PER_NOTE}):</span>
                <span className="font-medium text-gray-800">₦{printingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center"><Truck className="w-4 h-4 mr-1.5 text-gray-500"/>Delivery Fee:</span>
                <span className="font-medium text-gray-800">₦{DELIVERY_FEE.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center"><FileText className="w-4 h-4 mr-1.5 text-gray-500"/>Reconciliation Fee:</span>
                <span className="font-medium text-gray-800">₦{RECONCILIATION_FEE.toLocaleString()}</span>
              </div>
              <hr className="my-2 border-gray-300"/>
              <div className="flex justify-between items-center text-base font-semibold">
                <span className="text-gray-800">Total Estimated Cost:</span>
                <span className="text-bluePrimary">₦{totalCost.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isProcessingPayment}>
            Cancel
          </Button>
          <Button
            onClick={handleInitiatePayment}
            disabled={isProcessingPayment || totalNotes === 0}
            className="bg-bluePrimary text-white hover:bg-bluePrimary/90"
          >
            {isProcessingPayment ? 'Processing...' : `Pay ₦${totalCost.toLocaleString()}`}
          </Button>
        </div>
      </div>
    </div>
  );
} 