import React, { useState } from 'react';
import { Button, Box, Typography, LinearProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled, alpha } from '@mui/material/styles'; // Import alpha for color manipulation

// Styled component to visually hide the file input, but keep it accessible
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function FileUploader({ label, onUpload }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [progress, setProgress] = useState(0); // Add progress state

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      // If no file is selected, clear previous state and return
      setFileUrl('');
      setError('');
      setUploading(false);
      setProgress(0);
      onUpload(''); // Clear URL in parent if file is deselected
      return;
    }

    setError('');
    setUploading(true);
    setProgress(0); // Reset progress for new upload

    const formData = new FormData();
    formData.append('file', file); // 'file' should match the name your backend expects

    try {
      const xhr = new XMLHttpRequest(); // Use XMLHttpRequest for progress tracking
      xhr.open('POST', 'http://localhost/smarthr_proj/upload_file.php');

      // Listen for progress events
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          setProgress(percentCompleted);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success) {
            setFileUrl(data.url);
            onUpload(data.url); // Send URL back to parent form
            setError(''); // Clear any previous errors on success
          } else {
            setError(data.message || 'Upload failed');
            setFileUrl(''); // Clear URL if upload fails
            onUpload(''); // Clear URL in parent on failure
          }
        } else {
          setError(`Server error: ${xhr.status} ${xhr.statusText}`);
          setFileUrl(''); // Clear URL if server error
          onUpload(''); // Clear URL in parent on server error
        }
        setUploading(false);
        setProgress(0); // Reset progress after completion
      };

      xhr.onerror = () => {
        setError('Network error during upload.');
        setUploading(false);
        setFileUrl('');
        onUpload('');
        setProgress(0);
      };

      xhr.send(formData);

    } catch (err) {
      setError('Upload initiation error: ' + err.message);
      setUploading(false);
      setFileUrl('');
      onUpload('');
      setProgress(0);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1, color: '#555', fontWeight: 500 }}>
        {label}
      </Typography>
      <Button
        component="label" // This makes the Button act as a label for the hidden input
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        fullWidth
        disabled={uploading}
        sx={{
          borderRadius: '8px',
          padding: '12px 16px',
          borderColor: '#007aff', // Primary blue border
          color: '#007aff', // Primary blue text
          '&:hover': {
            backgroundColor: alpha('#007aff', 0.05), // Light blue hover effect
            borderColor: '#007aff',
          },
          '&.Mui-disabled': {
            borderColor: '#cccccc',
            color: '#cccccc',
          },
        }}
      >
        {uploading ? `Uploading (${progress}%)` : 'Choose File'}
        <VisuallyHiddenInput type="file" onChange={handleFileChange} />
      </Button>
      {uploading && (
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1, height: 8, borderRadius: 4 }} // Rounded progress bar
        />
      )}
      {error && (
        <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
          {error}
        </Typography>
      )}
      {fileUrl && (
        <Typography variant="body2" sx={{ mt: 1, color: '#777' }}>
          Uploaded: <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007aff', textDecoration: 'none', fontWeight: 500 }}>
            {fileUrl.split('/').pop()} {/* Display only file name */}
          </a>
        </Typography>
      )}
    </Box>
  );
}