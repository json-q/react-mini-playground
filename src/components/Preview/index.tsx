import iframeRaw from './iframe.html?raw';

const iframeUrl = URL.createObjectURL(new Blob([iframeRaw], { type: 'text/html' }));

export default function Preview() {
  return (
    <iframe
      title="Preview"
      src={iframeUrl}
      style={{ width: '100%', height: '100%', padding: 0, border: 'none' }}
    />
  );
}
