import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CurrencyCanvas } from './CurrencyCanvas';
import { debounce } from 'lodash';
import { useLocation } from 'react-router-dom';
import { getEvents } from '@/api/eventApi';

export function TextEditor({ side, initialTexts, onClose, onSave, denomination }) {
  const location = useLocation();
  const [texts, setTexts] = useState(initialTexts || {
    celebration: 'Celebration of Life',
    currencyName: side === 'front' ? 'Party Currency' : '',
    eventId: '',
  });

  useEffect(() => {
    const fetchEventId = async () => {
      // Check if we came from event creation
      const fromEventId = location.state?.eventId;
      if (fromEventId) {
        setTexts(prev => ({ ...prev, eventId: fromEventId }));
        return;
      }

      // Check session storage for recently created event
      const lastCreatedEventId = sessionStorage.getItem('lastCreatedEventId');
      if (lastCreatedEventId) {
        setTexts(prev => ({ ...prev, eventId: lastCreatedEventId }));
        return;
      }

      // If no event ID found, try to get most recent event
      try {
        const eventsData = await getEvents();
        if (eventsData?.events?.length > 0) {
          const mostRecent = eventsData.events[0];
          setTexts(prev => ({ ...prev, eventId: mostRecent.event_id }));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    if (side === 'front') {
      fetchEventId();
    }
  }, [side, location.state]);

  const updateText = debounce((key, value) => {
    setTexts(prev => ({ ...prev, [key]: value }));
  }, 100);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-6xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit {side === 'front' ? 'Front' : 'Back'} Text</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Preview */}
            <div className="w-full">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <CurrencyCanvas
                  templateImage={`/lovable-uploads/${denomination}-${side}-template.png`}
                  texts={texts}
                  side={side}
                  denomination={denomination}
                />
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="celebration" className="block mb-2 text-left">
                  Celebration Text
                </Label>
                <Input
                  id="celebration"
                  value={texts.celebration}
                  onChange={(e) => updateText('celebration', e.target.value)}
                  maxLength={20}
                  placeholder="Enter celebration text"
                />
                <p className="text-sm text-gray-500 mt-1 text-left">
                  Maximum 20 characters
                  {side === 'back' && ' - Will appear at the bottom right of the currency'}
                </p>
              </div>

              {side === 'front' && (
                <>
                <div>
                  <Label htmlFor="currencyName" className="block mb-2 text-left">
                    Currency Name
                  </Label>
                  <Input
                    id="currencyName"
                    value={texts.currencyName}
                    onChange={(e) => updateText('currencyName', e.target.value)}
                    maxLength={20}
                    placeholder="Enter currency name"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-left">
                    Maximum 20 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="eventId" className="block mb-2 text-left">
                    Event ID
                  </Label>
                  <Input
                    id="eventId"
                    value={texts.eventId}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1 text-left">
                      {texts.eventId 
                        ? "Event ID is automatically linked to your event"
                        : "No event linked - You can still customize the template and save it for later"}
                  </p>
                </div>
                </>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => onSave(texts)}
                  className="bg-bluePrimary hover:bg-bluePrimary/90 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
