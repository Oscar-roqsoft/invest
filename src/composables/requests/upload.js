// composables/requests/upload.js
import { API_BASE_URL, TOKEN_KEY } from '~/composables/constants';

export const useUploadRequests = () => {
  const { compressImage } = useImageCompressor();

  /**
   * Upload a file with auto-compression.
   *
   * @param {File} file
   * @param {Object} options
   *   - type: 'avatar' | 'kyc_document' | 'kyc_selfie' | 'general'
   *   - fieldName: name expected by backend Multer (default 'image')
   *   - compress: boolean (default true for images)
   *   - compressionOptions: { maxSizeMB, maxWidthOrHeight, ... }
   *   - onProgress: (percent) => void
   *   - onCompressionProgress: (percent) => void
   */
  const uploadFile = async (file, options = {}) => {
    const {
      type = 'general',
      fieldName = 'image',           // ⭐ matches backend upload.single('image')
      compress = true,
      compressionOptions = {},
      onProgress = null,
      onCompressionProgress = null,
    } = options;

    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // ─── STEP 1: COMPRESS (images only) ──────────────────────
    let fileToUpload = file;
    let compressionInfo = null;

    if (compress && file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
      const compResult = await compressImage(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        initialQuality: 0.82,
        fileType: 'image/jpeg',
        onProgress: onCompressionProgress || undefined,
        ...compressionOptions,
      });

      if (compResult.success && compResult.file) {
        fileToUpload = compResult.file;
        compressionInfo = {
          originalSize: compResult.originalSize,
          compressedSize: compResult.compressedSize,
          savings: compResult.savings,
        };
      }
    }

    // ─── STEP 2: SIZE CHECK ───────────────────────────────────
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (fileToUpload.size > maxSize) {
      return {
        success: false,
        message: `File too large (${formatBytes(fileToUpload.size)}). Max is 5MB.`,
      };
    }

    // ─── STEP 3: BUILD FORMDATA ───────────────────────────────
    const formData = new FormData();
    formData.append(fieldName, fileToUpload);  // ⭐ dynamic field name
    if (type) formData.append('type', type);   // backend can use this for folder

    const token = import.meta.client ? localStorage.getItem(TOKEN_KEY) : null;
    const url = `${API_BASE_URL}/upload${type ? `?type=${type}` : ''}`;

    // ─── STEP 4: UPLOAD ───────────────────────────────────────
    try {
      const response = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress && xhr.upload) {
          xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100);
              onProgress(percent);
            }
          });
        }

        xhr.addEventListener('load', () => {
          try {
            const data = JSON.parse(xhr.responseText || '{}');
            resolve({
              status: xhr.status,
              ok: xhr.status >= 200 && xhr.status < 300,
              data,
            });
          } catch {
            resolve({ status: xhr.status, ok: false, data: {} });
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error')));
        xhr.addEventListener('abort', () => reject(new Error('Upload aborted')));

        xhr.open('POST', url);
        if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      if (!response.ok) {
        return {
          success: false,
          status: response.status,
          message:
            response.data?.message ||
            `Upload failed with status ${response.status}`,
        };
      }

      // ─── STEP 5: EXTRACT URL ────────────────────────────────
      // Backend returns: { success: true, imageUrl: "..." }
      // We also support other common shapes as fallbacks.
      const d = response.data;
      const fileUrl =
        d?.imageUrl ||              // ⭐ matches your backend
        d?.data?.imageUrl ||
        d?.data?.url ||
        d?.data?.file?.url ||
        d?.data?.path ||
        d?.url ||
        d?.path ||
        d?.fileUrl ||
        null;

      if (!fileUrl) {
        console.warn('Upload response has no URL:', d);
        return {
          success: false,
          message: 'Upload succeeded but no URL returned',
          raw: d,
        };
      }

      return {
        success: true,
        url: fileUrl,
        raw: d,
        message: d?.message || 'Upload successful',
        compression: compressionInfo,
      };
    } catch (error) {
      console.error('Upload error:', error);
      return { success: false, message: error.message };
    }
  };

  return { uploadFile };
};

// ─────────────────────────────────────────────────────────────
function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}