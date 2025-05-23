import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCurrencies, deleteCurrency } from '@/api/currencyApi';
import { getEvents } from '@/api/eventApi';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { Download, Files, Edit, PlusCircle, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { CurrencyImage, downloadCurrencyImage } from '@/components/ui/CurrencyImage';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CurrencyCanvas } from './CurrencyCanvas';

function getTemplateImage(denomination){
  console.log('denomination', denomination)
  if(denomination === 200) return '/lovable-uploads/200-front-template.png'
  if(denomination === 500) return '/lovable-uploads/500-front-template.png'
  if(denomination === 1000) return '/lovable-uploads/1000-front-template.png'
  return '/lovable-uploads/200-front-template.png'
}
export function UserCurrencies() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [events, setEvents] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, templateId: null });
  const [previewDialog, setPreviewDialog] = useState({ open: false, template: null });
  const [templateImages, setTemplateImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch currencies
        const currencyData = await getAllCurrencies();
        console.log('Templates data:', currencyData);
        
        // Fetch events to map event names
        const eventsData = await getEvents();
        const eventsMap = {};
        
        if (eventsData && eventsData.events) {
          eventsData.events.forEach(event => {
            eventsMap[event.event_id] = event.event_name;
          });
        }
        
        setEvents(eventsMap);
        setTemplates(currencyData || []);

        // Download images for each template
        const imagesMap = {};
        console.log("downloading images", currencyData)
        if (currencyData && currencyData.length > 0) {
          const downloadPromises = currencyData.map(async (template) => {
            const denomination = template.denomination || '200';
            try {
              const frontImageUrl = await downloadCurrencyImage(template.front_image, denomination, 'front');
              const backImageUrl = await downloadCurrencyImage(template.back_image, denomination, 'back');
              imagesMap[template.currency_id] = {
                front: frontImageUrl,
                back: backImageUrl
              };
              console.log("downloaded images", imagesMap)
            } catch (err) {
              console.error(`Error downloading images for template ${template.currency_id}:`, err);
            }
          });
          await Promise.all(downloadPromises);
        }
        setTemplateImages(imagesMap);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.message === 'Session expired. Please login again.') {
          toast.error('Your session has expired. Please login again.');
          navigate('/login');
        } else {
          setError(error.message);
          toast.error('Failed to load templates. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const getEventName = (eventId) => {
    if (!eventId || eventId === 'no_event') return 'No Event';
    return events[eventId] || 'Unknown Event';
  };


  const handleDownload = async (template) => {
    try {
      // Check if front_image exists, if not display an error
      const imageUrl = template.front_image;
      
      if (!imageUrl) {
        throw new Error('No image available for this template');
      }
      
      // For Google Drive links, we need to modify the URL to get the direct download link
      const directUrl = imageUrl.includes('drive.google.com') 
        ? imageUrl.replace('/view?usp=sharing', '/uc?export=download')
        : imageUrl;
      
      window.open(directUrl, '_blank');
      toast.success('Opening image for download');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error(error.message || 'Failed to download template. Please try again.');
    }
  };

  const handleDelete = async (templateId) => {
    try {
      setIsLoading(true);
      await deleteCurrency(templateId);
      
      // Update templates list after deletion
      setTemplates(templates.filter(t => t.currency_id !== templateId));
      
      toast.success('Template deleted successfully');
      setDeleteDialog({ open: false, templateId: null });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (template) => {
    const denomination = template.denomination || '200'
    navigate(`/customize-${denomination}`, {
      state: { 
        templateId: template.currency_id,
        eventId: template.event_id 
      }
    });
  };

  const handlePreview = (template) => {
    setPreviewDialog({ open: true, template });
  };

  if (isLoading) {
    return <LoadingDisplay message="Loading your saved templates..." />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Files className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load templates</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          {error}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Files className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved templates yet</h3>
        <p className="text-gray-600 mb-6 max-w-sm">
          Start by customizing a currency template from the available options.
        </p>
        <Button
          onClick={() => navigate('/templates')}
          className="inline-flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Create Your First Template
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 ">
        {templates.map((template) => {
          const denomination = template.denomination || '200';
          const templateImage = templateImages[template.currency_id];
          console.log('currency image', templateImage, template )
          return (
            <div
              key={template.currency_id}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className=" bg-gray-100 relative">
                <div className='w-full relative '>
              <CurrencyCanvas
                    templateImage={getTemplateImage(denomination)}
                    texts={{
                      eventId: template.event_id,
                      currencyName: template.currency_name,
                      celebration: template.front_celebration_text,
                      dominationText:"200",
             

                    }}
                    side="front"
                    denomination={denomination}
                    portraitImage={templateImage.front}
                  />
                </div>
                
                <div className="absolute top-2 right-2">
                  <span className="bg-gold text-white px-2 py-1 rounded text-xs font-semibold">
                    ₦{denomination}
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex flex-col mb-2">
                  <h3 className="font-semibold text-lg">
                    {template.currency_name || 'Party Currency'}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(template.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {getEventName(template.event_id)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 truncate">
                  {template.front_celebration_text || 'Celebration of Life'}
                </p>
                
                <div className="flex flex-wrap justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    className="inline-flex items-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(template)}
                    className="inline-flex items-center gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="inline-flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteDialog({ open: true, templateId: template.currency_id })}
                    className="inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this currency template? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 sm:justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, templateId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteDialog.templateId)}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onOpenChange={(open) => setPreviewDialog(prev => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
          </DialogHeader>
          
          {previewDialog.template && (
            <div className="space-y-4 overflow-y-auto">
              <div>
                <h3 className="font-medium mb-2">Front Side</h3>
                <div className="border rounded-lg overflow-hidden max-h-[300px] md:max-h-[400px] relative">
                  {templateImages[previewDialog.template.currency_id]?.front ? (
                    <div className="w-full relative">
                      <CurrencyCanvas
                        templateImage={getTemplateImage(previewDialog.template.denomination)}
                        texts={{
                          eventId: previewDialog.template.event_id,
                          currencyName: previewDialog.template.currency_name,
                          celebration: previewDialog.template.front_celebration_text,
                          dominationText: previewDialog.template.denomination || "200",
                        }}
                        side="front"
                        denomination={previewDialog.template.denomination || "200"}
                        portraitImage={templateImages[previewDialog.template.currency_id].front}
                      />
                    </div>
                  ) : (
                    <CurrencyImage
                      driveUrl={previewDialog.template.front_image}
                      alt="Front"
                      className="w-full h-auto"
                      denomination={previewDialog.template.denomination || '200'}
                      side="front"
                    />
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Back Side</h3>
                <div className="border rounded-lg overflow-hidden max-h-[300px] md:max-h-[400px] relative">
                  {templateImages[previewDialog.template.currency_id]?.back ? (
                    <div className="w-full relative">
                      <CurrencyCanvas
                         templateImage={getTemplateImage(previewDialog.template.denomination)}
                        texts={{
                          eventId: previewDialog.template.event_id,
                          currencyName: previewDialog.template.currency_name,
                          celebration: previewDialog.template.back_celebration_text,
                          dominationText: previewDialog.template.denomination || "200",
                        }}
                        side="back"
                        denomination={previewDialog.template.denomination || "200"}
                        portraitImage={templateImages[previewDialog.template.currency_id].back}
                      />
                    </div>
                  ) : (
                    <CurrencyImage
                      driveUrl={previewDialog.template.back_image}
                      alt="Back"
                      className="w-full h-auto"
                      denomination={previewDialog.template.denomination || '200'}
                      side="back"
                    />
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Currency Name:</p>
                  <p>{previewDialog.template.currency_name || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">Event:</p>
                  <p>{getEventName(previewDialog.template.event_id)}</p>
                </div>
                <div>
                  <p className="font-medium">Front Text:</p>
                  <p>{previewDialog.template.front_celebration_text || 'Not specified'}</p>
                </div>
                <div>
                  <p className="font-medium">Back Text:</p>
                  <p>{previewDialog.template.back_celebration_text || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setPreviewDialog({ open: false, template: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 