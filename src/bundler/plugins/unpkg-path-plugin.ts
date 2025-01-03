import * as esbuild from "esbuild-wasm";


export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // хендлер для index.js
      build.onResolve({ filter: /^index\.js$/ }, async (args: any) => {
        return { path: args.path, namespace: "a" };
      });

      // хендлер для относительных путей типа ./ ../
      build.onResolve({ filter: /^\.+\// }, async (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });

      // хендлер для главного файла в модуле
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });

    
    },
  };
};
