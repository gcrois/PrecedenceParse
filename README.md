# Operator Parenthesizer

The **Operator Parenthesizer** is a React-based application that allows users to define operators (with precedence and associativity) and input code. The app then generates a custom grammar based on these operators, parses the input code, and outputs a parenthesized version of the code based on the defined grammar. Created using ohm.js :)

## Features

-   Define custom operators with a symbol, precedence, and associativity (left or right).
-   Input arbitrary code to be parsed.
-   Live display of the generated grammar based on the defined operators.
-   Outputs a version of the input code with the correct operator precedence and associativity using parentheses.

## How It Works

-   The user can define operators by specifying:
    -   The symbol (e.g., `+`, `*`).
    -   The precedence (an integer).
    -   The associativity (left or right).
-   Operators are added to a table as you define them.
