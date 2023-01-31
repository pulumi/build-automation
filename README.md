# Automate Pulumi Provider Build File Generation

Automation to keep Github Actions workflows up to date for Pulumi &amp; third-party
repositories.

The initial code in this repository is migrated from [pulumi/ci-mgmt](https://github.com/pulumi/ci-mgmt)
and updated to be reusable for third parties like Pulumiverse, partners, etc. Most changes after the
initial migration are aimed at a broader reuse of what is in this package.

## Structure

This repository is set up as an NPM workspace, with the folders mapping to a published package on NPM:

| Package Folder | Published Package |
| --- | --- |
| [packages/config](packages/config/) | [@pulumi/build-config](https://www.npmjs.com/package/@pulumi/build-config) |
| [packages/workflows](packages/config/) | [@pulumi/github-workflows](https://www.npmjs.com/package/@pulumi/github-workflows) |

## Contributing

1. `npm install` - installs modules for all workspaces
