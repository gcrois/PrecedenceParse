// Parser.ts

import * as ohm from "ohm-js";

export interface Operator {
	symbol: string;
	precedence: number;
	associativity: "left" | "right";
}

export function parseAndParenthesize(
	grammar: ohm.Grammar,
	input: string,
	operators: Operator[],
): string {
	try {
		const semantics = createSemantics(grammar, operators);
		console.log("semantics", semantics);
		const matchResult = grammar.match(input);

		if (matchResult.failed()) {
			return "Error: " + matchResult.message;
		}

		const parenthesized = semantics(matchResult).parenthesize();
		return parenthesized;
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : e;
		return "Error: " + errorMessage;
	}
}

export function generateGrammar(operators: Operator[]) {
	const maxPrecedence = getMaxPrecedence(operators);
	let grammarDefinition = `
      G {
        Exp = Exp1
    `;

	for (let precedence = 1; precedence <= maxPrecedence; precedence++) {
		const opsAtPrecedence = operators.filter(
			(op) => op.precedence === precedence,
		);
		const nextExp =
			precedence < maxPrecedence ? `Exp${precedence + 1}` : "Primary";

		if (opsAtPrecedence.length > 0) {
			const leftAssociativeOps = opsAtPrecedence.filter(
				(op) => op.associativity === "left",
			);
			const rightAssociativeOps = opsAtPrecedence.filter(
				(op) => op.associativity === "right",
			);

			let ruleAlternatives: string[] = [];

			if (leftAssociativeOps.length > 0) {
				const leftOpsSymbols = leftAssociativeOps
					.map((op) => JSON.stringify(op.symbol))
					.join(" | ");
				ruleAlternatives.push(
					`Exp${precedence} (${leftOpsSymbols}) ${nextExp}  -- left`,
				);
			}

			if (rightAssociativeOps.length > 0) {
				const rightOpsSymbols = rightAssociativeOps
					.map((op) => JSON.stringify(op.symbol))
					.join(" | ");
				ruleAlternatives.push(
					`${nextExp} (${rightOpsSymbols}) Exp${precedence}  -- right`,
				);
			}

			ruleAlternatives.push(nextExp); // Base case

			grammarDefinition += `
          Exp${precedence}
            = ${ruleAlternatives.join("\n        | ")}
        `;
		} else {
			// No operators at this precedence level
			grammarDefinition += `
          Exp${precedence}
            = ${nextExp}
        `;
		}
	}

	grammarDefinition += `
        Primary
          = number
          | ident
          | ParenExp
  
        ParenExp
          = "(" Exp ")"
  
        number
          = digit+
  
        ident
          = letter (letter | digit)*
  
        space += " " | "\\t" | "\\n"
      }
    `;

	const grammar = ohm.grammar(grammarDefinition);
	const definition = grammarDefinition;

	return { grammar, definition };
}

function getMaxPrecedence(operators: Operator[]): number {
	return Math.max(...operators.map((op) => op.precedence), 0);
}

function createSemantics(grammar: ohm.Grammar, operators: Operator[]) {
	const operatorMap: { [symbol: string]: Operator } = {};
	for (const op of operators) {
		operatorMap[op.symbol] = op;
	}

	const semantics = grammar.createSemantics();

	semantics.addOperation("parenthesize", {
		Exp(e) {
			return e.parenthesize();
		},
		Primary(e) {
			return e.parenthesize();
		},
		ParenExp(_open, exp, _close) {
			return `(${exp.parenthesize()})`;
		},
		number(_digits) {
			return this.sourceString;
		},
		ident(_first, _rest) {
			return this.sourceString;
		},
		_terminal() {
			return this.sourceString;
		},
		_iter(...children) {
			return children.map((c) => c.parenthesize()).join("");
		},
		...generateSemanticsForExpN(operators, operatorMap),
	});

	return semantics;
}

function generateSemanticsForExpN(
	operators: Operator[],
	operatorMap: { [symbol: string]: Operator },
) {
	const maxPrecedence = getMaxPrecedence(operators);
	const semantics: any = {};

	for (let precedence = maxPrecedence; precedence >= 1; precedence--) {
		const opsAtPrecedence = operators.filter(
			(op) => op.precedence === precedence,
		);
		const leftAssociativeOps = opsAtPrecedence.filter(
			(op) => op.associativity === "left",
		);
		const rightAssociativeOps = opsAtPrecedence.filter(
			(op) => op.associativity === "right",
		);

		if (leftAssociativeOps.length > 0) {
			semantics[`Exp${precedence}_left`] = function (
				left: any,
				opToken: any,
				right: any,
			) {
				const op = opToken.sourceString.trim();
				const leftExpr = left.parenthesize();
				const rightExpr = right.parenthesize();
				const result = maybeAddParens(
					`${leftExpr} ${op} ${rightExpr}`,
					op,
					operatorMap,
				);
				return result;
			};
		}

		if (rightAssociativeOps.length > 0) {
			semantics[`Exp${precedence}_right`] = function (
				left: any,
				opToken: any,
				right: any,
			) {
				const op = opToken.sourceString.trim();
				const leftExpr = left.parenthesize();
				const rightExpr = right.parenthesize();
				const result = maybeAddParens(
					`${leftExpr} ${op} ${rightExpr}`,
					op,
					operatorMap,
				);
				return result;
			};
		}

		// Base case for single expressions
		semantics[`Exp${precedence}`] = function (child: any) {
			return child.parenthesize();
		};
	}

	return semantics;
}

function maybeAddParens(
	expression: string,
	operator: string,
	operatorMap: { [symbol: string]: Operator },
): string {
	// Implement parenthesis logic based on operator precedence and associativity if needed
	// For simplicity, we'll add parentheses around every expression involving an operator
	return `(${expression})`;
}
