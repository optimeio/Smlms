// Resilient Avatar & Logo URL resolver for Students, Companies, Trainers, and Admins

export const getUserPhotoUrl = (user) => {
  if (!user) return '';

  const photoVal = 
    user.profilePhoto || 
    user.photo || 
    user.logo || 
    user.companyLogo || 
    user.avatar || 
    user.passportPhoto || 
    user.liveSelfie || 
    user.image ||
    (user.uploadedDocuments && (
      user.uploadedDocuments.photo || 
      user.uploadedDocuments.passportPhoto || 
      user.uploadedDocuments.liveSelfie || 
      user.uploadedDocuments.logo || 
      user.uploadedDocuments.profilePhoto
    ));

  if (!photoVal) return '';

  let str = '';
  if (typeof photoVal === 'string') {
    str = photoVal.trim();
  } else if (typeof photoVal === 'object' && photoVal !== null) {
    str = (photoVal.url || photoVal.path || photoVal.filename || photoVal.name || photoVal.uri || '').toString().trim();
  } else {
    str = String(photoVal || '').trim();
  }

  if (!str) return '';

  // Direct full URLs or Base64 data URLs
  if (str.startsWith('http://') || str.startsWith('https://') || str.startsWith('data:')) {
    return str;
  }

  // If already prefixed with uploads path
  if (str.startsWith('/uploads/') || str.startsWith('uploads/')) {
    return str.startsWith('/') ? str : `/${str}`;
  }

  // Filename resolution via streaming API
  const cleanFilename = str.split(/[/\\]/).pop();
  if (!cleanFilename) return '';

  return `/api/documents/view/${encodeURIComponent(cleanFilename)}`;
};

export const getInitials = (name, fallback = 'U') => {
  if (!name) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.trim().charAt(0).toUpperCase();
};

export const getRoleGradient = (role) => {
  const r = (role || '').toLowerCase();
  if (r.includes('company')) return 'linear-gradient(135deg, #f97316, #ea580c)';
  if (r.includes('trainer')) return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
  if (r.includes('admin')) return 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
  return 'linear-gradient(135deg, #10b981, #059669)'; // Student default
};
