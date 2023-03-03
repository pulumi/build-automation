# How to contribute to the Pulumi Build Automation setup

This repository is set up based on the following two reference repositories:

* [`actions/typescript-action`](https://github.com/actions/typescript-action): boilerplate repository containing a Github Action setup in Typescript
* [`github/codeql-action`](https://github.com/github/codeql-action): multiple Github Actions contained in a monorepo

To speed up testing, we build upon the following to allow local testing:

* `uses: ./<action-name>`: use this line in a test workflow to use your locally built action sources.
* [mock-github](https://github.com/kiegroup/mock-github): A library to create a local github environment and easily mock github APIs using an octokit like interface 
* [act-js](https://github.com/kiegroup/act-js): A node.js wrapper for [nektos/act](https://github.com/nektos/act) to programmatically run your github actions locally 
* [Jest](https://jestjs.io/): a Javascript test framework. 

The combination of all of the above allows to create a local test suite of workflows which test local code changes to the different Github Actions before we need to commit and/or publish anything.

Source: [Testing Github Actions locally](https://www.redhat.com/en/blog/testing-github-actions-locally)

## Testing

TBD Explain the actual setup here once we have it running for a first action.

## Updating the code of existing Github Actions

Run the complete build & test process for this repository:

```sh
$ npm ci
$ npm run all
```

If the code transpiled and all the tests succeeded, commit **all** changes to a branch. Continue with the regular review, merge & release of the Github Actions.

**NOTE:** Github Actions are always downloaded from Github repositories rather than NPM packages. As a result, the transpiled
code must always be committed to this repository.

## Adding a new Github Action to the setup

Every Github Action is defined by an `action.yml` file containing the metadata for the action (name, description, inputs, ...) and points to the actual Javascript file containing the entrypoint script. To add a new Github Action to this setup, add the file `src/<new-action-name>.ts` and define the entrypoint function as follows:

```ts
import * as core from '@actions/core';
...

async function run() {
  try { 
      ...
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
```

Note that we call the function at the end of the source file. Now add the Github Action metadata file in `<new-action-name>/action.yml`, with content similar to this:

```yaml
name: 'A Readable Action Name'
description: 'Extended description of this Github Action'
author: 'Pulumi'
inputs:
  # Schema definition of the inputs that can be passed to your action
  token:
    default: ${{ github.token }}
  matrix:
    default: ${{ toJson(matrix) }}
  working-directory:
    description: >-
      Run the autobuilder using this path (relative to $GITHUB_WORKSPACE) as
      working directory. If this input is not set, the autobuilder runs with
      $GITHUB_WORKSPACE as its working directory.
    required: false
runs:
  using: 'node16'
  main: '../lib/<new-action-name>.js'
```

Replace the `...` in your Typescript source file by your implementation and add tests to verify the behaviour.
