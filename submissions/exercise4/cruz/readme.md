Runner
===================

The **run.js** is a javascript program that runs syntax-analyzed cjs file.

----------

Specifications
-------------

**Variable Declaration**
Variable declaration can be done by using the following sequence: var [varname] = [value]. 
> * Currently, the variable declaration can only use string, numbers, and variables after the equal sign. Operations aren't implemented yet.

**Printing**
Printing can be done by calling the "print()" function. The parameters will be printed as string.
> * Currently, the printing function can only accept variables, numbers and string parameters.


Running the script
-------------

> **Requirements:**

> - Node.js
> - NPM replaceall
> - A file with correct lexemes (a ".cjs" file)

**Node.js**

To use, simply use the command below on the same directory as run.js and <.cjs file>.
```
node run.js <.cjs file>
```

**npm replaceall**

To install, use the command in the cli and enter y when prompted.
```
npm install replaceall
```