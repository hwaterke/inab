# inab-shared

Shared code between the web and native clients

# Why babelrc.json

Because this repository uses `lerna`, any package that depends on `inab-shared` will have a symlink to this directory in its `node_modules` directory.
The problem is that `react-native` compiles `node_modules` using their `.babelrc` file if there is one.
To prevent this, as `inab-shared` is already compiled, the `.babelrc` file is saved as `babelrc.json` and is renamed only at the time of compilation.
