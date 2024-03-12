import { useState, useEffect, useRef} from "react";
import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";


export const App = () => {
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');
    const ref = useRef<any>();

    const startService = async () => {
        const service = await esbuild.startService({
            worker: true,
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
        });

        ref.current = service;
    };

    useEffect( () => {
        startService();
    },[]);
    

    const onClick = async () => {
        if (ref.current && ref.current.build) {
            const result = await ref.current.build({
                entryPoints: ['index.js'],
                bundle: true,
                write: false,
                plugins: [unpkgPathPlugin(), fetchPlugin(input)],
                define: {
                    'process.env.NODE_ENV': '"production"',
                    global: 'window'
                }
            });

            console.log(result);

            setCode(result.outputFiles[0].text);

            try {
                eval(result.outputFiles[0].text);
            } catch (err) {
                alert(err);
            }
            
        }        
    };


    return (
        <div>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
            <button onClick={onClick}>Submit</button>
            <pre>
                {code}
            </pre>
        </div>
    );
};