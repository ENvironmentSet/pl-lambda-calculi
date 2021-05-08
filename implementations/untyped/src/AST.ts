export type LCTerm = LCVariable | LCAbstraction | LCApplication | LCGrouping;

export type Identifier = string;

export interface LCVariable {
  identifier: Identifier;
}
export function LCVariable(identifier: Identifier): LCVariable {
  return { identifier };
}

export interface LCAbstraction {
  parameter: Identifier;
  body: LCTerm;
}
export function LCAbstraction(parameter: Identifier, body: LCTerm): LCAbstraction {
  return { parameter, body };
}

export interface LCApplication {
  term: LCTerm;
  argument: LCTerm;
}
export function LCApplication(term: LCTerm, argument: LCTerm): LCApplication {
  return { term, argument };
}

export interface LCGrouping {
  term: LCTerm;
}
export function LCGrouping(term: LCTerm): LCGrouping {
  return { term };
}