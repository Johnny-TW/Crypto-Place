import { useCallback } from 'react';
import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useSelector } from 'react-redux';

const useDownload = () => {
  const { trackEvent } = useMatomo();
  const { token } = useSelector(state => state.auth);

  const download = (url, filename) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.responseType = 'blob';
    xhr.onload = () => {
      const blobUrl = window.URL.createObjectURL(xhr.response);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
    };
    xhr.send();
  };

  return useCallback(
    (url, filename) => {
      trackEvent({
        category: 'Read',
        action: 'Download',
        name: filename,
      });
      download(url, filename);
    },
    [trackEvent, token, download]
  );
};

export default useDownload;
