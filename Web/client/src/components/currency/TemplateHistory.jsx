import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCurrencies } from '@/services/currencyService';
import { LoadingDisplay } from '@/components/LoadingDisplay';
import { Download, Files, Edit, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export function TemplateHistory() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await getAllCurrencies();
        setTemplates(data.currencies || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching templates:', error);
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

    fetchTemplates();
  }, [navigate]);

  const handleDownload = async (template) => {
    try {
      const response = await fetch(template.preview_url);
      if (!response.ok) throw new Error('Failed to download template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `currency-template-${template.denomination}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully!');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template. Please try again.');
    }
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {templates.map((template) => (
        <div
          key={template.id}
          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-w-16 aspect-h-9 bg-gray-100">
            {template.preview_url ? (
              <img
                src={template.preview_url}
                alt={`Template ${template.id}`}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Files className="w-12 h-12" />
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">
                ₦{template.denomination} Template
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(template.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 truncate">
              {template.currency_name || 'Party Currency'}
            </p>
            
            <div className="flex justify-end gap-2">
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
                onClick={() => navigate(`/customize-${template.denomination}`, {
                  state: { templateId: template.id }
                })}
                className="inline-flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 