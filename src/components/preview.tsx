import React, { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
}

const html = `
<html>
    <head>
    </head>
    <body>
        <div id='root' > default </div>
        <script>
            window.addEventListener('message', (event) => {

                try {
                    eval(event.data);
                } catch (err) {
                    document.querySelector('#root').innerText = err.message;
                }
            }, false);
        </script>
    </body>
</html> 
`;

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>(null);

  useEffect(() => {
    iframe.current.srcdoc = html;

    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        srcDoc={html}
        title="preview"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default Preview;
