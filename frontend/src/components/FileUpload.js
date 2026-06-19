import { useState } from 'react';
import { Upload, FileText, Trash2, Download, AlertCircle } from 'lucide-react';

const FileUpload = ({ type = 'document', onUpload, existingFiles = [], onDelete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Validate file type based on upload type
    const allowedTypes = {
      cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      coverLetter: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      certificate: ['application/pdf', 'image/jpeg', 'image/png'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    };

    if (!allowedTypes[type].includes(file.type)) {
      setError('Invalid file type. Please upload a valid file.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // In a real app, this would upload to a server
      // For now, we'll simulate the upload and store file metadata
      const fileData = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString()
      };

      if (onUpload) {
        onUpload(fileData);
      }

      setUploading(false);
    } catch (err) {
      setError('Failed to upload file');
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getTypeLabel = () => {
    const labels = {
      cv: 'CV/Resume',
      coverLetter: 'Cover Letter',
      certificate: 'Certificate',
      document: 'Document'
    };
    return labels[type] || 'Document';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
        <input
          type="file"
          id={`file-upload-${type}`}
          className="hidden"
          onChange={handleFileUpload}
          accept={
            type === 'certificate' 
              ? '.pdf,.jpg,.jpeg,.png' 
              : '.pdf,.doc,.docx'
          }
        />
        <label
          htmlFor={`file-upload-${type}`}
          className="cursor-pointer"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-2">
            {uploading ? 'Uploading...' : `Click to upload ${getTypeLabel()}`}
          </p>
          <p className="text-sm text-gray-500">
            PDF, DOC, DOCX {type === 'certificate' ? ', JPG, PNG' : ''} (Max 5MB)
          </p>
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {existingFiles.map(file => (
            <div
              key={file.id}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <FileText className="w-5 h-5 text-green-700 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {file.url && (
                  <a
                    href={file.url}
                    download={file.name}
                    className="p-2 text-green-700 hover:bg-green-100 rounded transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(file.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
