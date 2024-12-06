import React, { useEffect, useRef } from 'react';
import './preview.css';

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
<html>
    <head>
    </head>
    <body>
        <div id='root' > default </div>
        <script>
            const handleError = (err) => {
              document.querySelector('#root').innerText = err.message;
              console.log(err);
            };  

            window.addEventListener('error', (event) => {
              handleError(event.error);
            });

            window.addEventListener('message', (event) => {

                try {
                    eval(event.data);
                } catch (err) {
                    handleError(err);
                }
            }, false);
        </script>
    </body>
</html> 
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
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
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;
