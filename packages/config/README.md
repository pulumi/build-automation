# Read the config file defining the build setup for a provider

Package: [@pulumi/build-config](https://www.npmjs.com/package/@pulumi/build-config)

To drive the generation of all the build related files for a Pulumi provider, 
a YAML config file is used for every provider. This package contains the 
[zod](https://www.npmjs.com/package/zod) based schema for this config file and the 
code to read these.
