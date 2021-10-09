# actions-insert-vars-into-container-def

## Summary
Inserts a set of variables into a YAML file using the Name/Value format. The changes are done in-place. To replace multiple placeholders,
multiple runs of this action can be used on the same file.

## Use the action like this:
```
name: Build and deploy

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-20.04
    outputs:
      imageVersion: ${{ steps.set_env_vars.outputs.imageVersion }}
      releaseTag: ${{ steps.set_env_vars.outputs.releaseTag }}
    steps:
      - name: Set environment vars for the Task Definition YAML
        uses: Keshigomi/actions-insert-vars-into-yaml@5d5dde...
        with:
          vars: |
            MONGODB_URI: "<your mongo uri>"
            PORT: '80'
            NODE_ENV: production
          file: .cloudformation/my-template.yaml
          varSeparator: "\r\n"
```

The above code replaces the placeholder `${placeholder}` with variables `MONGODB_URI`, `PORT`, and `NODE_ENV`, formatted in the YAML Name/Value format.

Before calling the action:
```
# .cloudformation/my-template.yaml

SomeYamlProperty:
  AnotherYamlProperty:
    ${placeholder}
```
After calling the action:
```
# .cloudformation/my-template.yaml

SomeYamlProperty:
  AnotherYamlProperty:
    - Name: MONGODB_URI
      Value: "<your mongo uri>"
    - Name: PORT
      Value: '80'
    - Name: NODE_ENV
      Value: production
```
## Notes about the example above:
- The variable block is inserted at the same indent as the `${placeholder}`. This is because the default
indent size is `auto`. To override this behavior, set the `indentSize` to a specific number.
- The variable values in the parameters are using 3 different quotation styles, and the results re-use the same styles.
- The variables will be inserted using `\r\n` as the separator. It is expected for the whole file to use this separator, since as part of the processing, the file has to be split into lines and re-assembled. This is necessary to determine the indent of the placeholder location.

## Full list of options one could use:

| Option | Details |
| ---- | ---- |
| file (required)| Path to the file to update |
| encoding (optional)| The encoding to use to open and save the file. Default is 'utf-8' |
| placeholder (optional) | The value to replace in the `file`. Default is `${placeholder}` |
| varSeparator (optional) | The separator to use when reading the `file` and writing the `vars`. Default is `\n`. |
| indentSize | `auto`, or a number that represents the size of indent to use for each line of inserted text. Default is `auto`, which uses the same indent as the indent of the placeholder on that line in the `file` |
| vars | The list of variables to insert, one per line. Each variable should be in the format `VAR_NAME: VALUE`. Quotations around the value are preserved, so single or double quotes are ok. If no value is provided, the variable is set to `null`. Each variable is written in the 2-line format like in the example above.
