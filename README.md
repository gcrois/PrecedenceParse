# Operator Parenthesizer

The **Operator Parenthesizer** is a React-based application that allows users to define operators (with precedence and associativity) and input code. The app then generates a custom grammar based on these operators, parses the input code, and outputs a parenthesized version of the code based on the defined grammar.

## Features

- Define custom operators with a symbol, precedence, and associativity (left or right).
- Input arbitrary code to be parsed.
- Live display of the generated grammar based on the defined operators.
- Outputs a version of the input code with the correct operator precedence and associativity using parentheses.

## How It Works

1. **Define Operators**: 
   - The user can define operators by specifying:
     - The symbol (e.g., `+`, `*`).
     - The precedence (an integer).
     - The associativity (left or right).
   - Operators are added to a table as you define them.

2. **Input Code**:
   - The user can input any code in the provided text area. This code will be parsed according to the defined operators.

3. **Live Parsing**:
   - As the user defines operators or inputs code, the app automatically generates a grammar using the custom operators and parses the input code.
   - The app then displays the output, which is a parenthesized version of the input code based on operator precedence.

4. **Grammar Display**:
   - The generated grammar, based on the defined operators, is displayed live in the UI.

## Technologies Used

- **React**: The app is built using React for interactive user interfaces.
- **ohm-js**: Used for grammar generation and parsing.
- **TypeScript**: Adds type safety and developer tooling for better maintainability.

## File Structure

- **App.tsx**: The main component that handles state and rendering.
- **OperatorDefinitionTable.tsx**: A component for defining and listing operators.
- **CodeInput.tsx**: A component for inputting the code.
- **Output.tsx**: A component for displaying the parsed output.