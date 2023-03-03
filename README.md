# Automate Pulumi Provider Build Setup

Automation to keep the build setup up to date for Pulumi &amp; third-party
repositories:

* Makefiles
* Github Actions workflows
* Linting setup

The initial code in this repository is migrated from [pulumi/ci-mgmt](https://github.com/pulumi/ci-mgmt)
and updated to be reusable for third parties like Pulumiverse, partners, etc. Most changes after the
initial migration are aimed at a broader reuse of what is in this package.

## Provided Actions

This repository is set up as a monorepo containing multiple Github Actions. 
Here is an overview of the different actions:

| Action | Description |
| --- | --- |
| [update-workflows](update-workflows/) | [@pulumi/github-workflows](https://www.npmjs.com/package/@pulumi/github-workflows) |

## Supporting code

All the code backing the different Actions can be found in these folders:

| Folder | Description |
| --- | --- |
| [src](src/) | the Typescript code for *all* Github Actions living in this repository. |
| [lib](lib/) | the transpiled Javascript code for *all* Github Actions living in this repository. |

**NOTE:** Github Actions are always downloaded from Github repositories rather than NPM packages. As a result, the transpiled
code must always be committed to this repository.
