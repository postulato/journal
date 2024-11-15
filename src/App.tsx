import { useState, useEffect, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";
import CodeEditor from "./components/code-editor";

export const App = () => {
  const [input, setInput] = useState("");
  const ref = useRef<any>();
  const iframe = useRef<any>(null);

  const startService = async () => {
    const service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });

    ref.current = service;
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (ref.current && ref.current.build) {
      iframe.current.srcdoc = html;

      const result = await ref.current.build({
        entryPoints: ["index.js"],
        bundle: true,
        write: false,
        plugins: [unpkgPathPlugin(), fetchPlugin(input)],
        define: {
          "process.env.NODE_ENV": '"production"',
          global: "window",
        },
      });

      iframe.current.contentWindow.postMessage(result.outputFiles[0].text, "*");
    }
  };

  const html = `
        <html>
            <head></head>
            <body>
                <div id='root'></div>
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

  return (
    <div>
      <CodeEditor />
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <button onClick={onClick}>Submit</button>
      <iframe
        ref={iframe}
        srcDoc={html}
        title="my-iframe"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  );
};
