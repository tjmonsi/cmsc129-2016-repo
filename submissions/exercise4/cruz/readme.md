Runner
===================

The **run.js** is a javascript program that interprets the syntax-analyzed cjs file.

----------

Specifications
-------------

**Variable Declaration**
Variable declaration can be done by using the following sequence: var [varname] = [value]. 
> * Currently, the variable declaration can only use string, numbers, and variables after the equal sign. Operations aren't implemented yet.
> * Currently, all variables declared are globally scoped

**Variable Assignment**
Variable assignment can be done by using the following sequence: [varname] = [value]. The variable should already be existing before it can be set.
> * Currently, the variable declaration can only use string, numbers, and variables after the equal sign. Operations aren't implemented yet.
> * Currently, variable naming cannot contain numbers

**Printing**
Printing can be done by calling the "print()" function. The parameters will be printed as string.
> * Currently, the printing function can only accept variables, numbers and string parameters.
> * It cannot process expressions containing variables. e.g. print(x+2)
> * It can, however, process expressions of strings or variables. e.g. print(1+2)

**Function Calls**
Function calling can be done by simply using the function as long as it exists.
> * Currently, the function call function can be done without parameters.

**Computation**
Using operations +, -, *, /, and % in numbers works fine. Can be used in variable declaration and assignments.
> * Currently, only one computation operation per line
> * + also works as concatenation for strings
> * To convert number to string, use ""+<number>
> * <number>+<string> will result to an error

**If Statement**
If statement must be called exactly as: if(<Expression>){<Code Block>}else{<Code Block>}.
> * Currently, there are no else-if statements. To do this, insert if inside else code block.
> * Currently, the Boolean value is 1 or anything else. If the value is not numeric 1, value is false, else true.

**While Loop**
While loop must be called with brackets.


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