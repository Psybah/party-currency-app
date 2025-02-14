import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { CurrencyCanvas } from './CurrencyCanvas';

export function TextEditor({ side, initialTexts, onClose, onSave }) {
  const [texts, setTexts] = useState(initialTexts || {
    celebration: 'Celebration of Life',
    currencyName: side === 'front' ? 'Party Currency' : '',
    eventId: side === 'front' ? 'A2BB26789' : '',
  });

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
                  templateImage={`/lovable-uploads/200-${side}-template.png`}
                  texts={texts}
                  side={side}
                />
              </div>
            </div>

            {/* Text Inputs */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="celebration" className="block mb-2">
                  Celebration Text
                </Label>
                <Input
                  id="celebration"
                  value={texts.celebration}
                  onChange={(e) => setTexts(prev => ({ ...prev, celebration: e.target.value }))}
                  maxLength={20}
                  placeholder="Enter celebration text"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Maximum 20 characters
                </p>
              </div>

              {side === 'front' && (
                <div>
                  <Label htmlFor="currencyName" className="block mb-2">
                    Currency Name
                  </Label>
                  <Input
                    id="currencyName"
                    value={texts.currencyName}
                    onChange={(e) => setTexts(prev => ({ ...prev, currencyName: e.target.value }))}
                    maxLength={20}
                    placeholder="Enter currency name"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum 20 characters
                  </p>
                </div>
              )}

              {side === 'front' && (
                <div>
                  <Label htmlFor="eventId" className="block mb-2">
                    Event ID
                  </Label>
                  <Input
                    id="eventId"
                    value={texts.eventId}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Event ID is automatically generated
                  </p>
                </div>
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
