import { Parser, bind, map, bindTo, either, between, surroundedBy, chain, chainFirst } from 'parser-ts/Parser';
import { LCAbstraction, LCApplication, LCGrouping, LCTerm, LCVariable } from './AST';
import { constant, pipe } from 'fp-ts/function';
import { spaces, many1, string } from 'parser-ts/string';
import { letter, Char, char } from 'parser-ts/char';
import { Stream } from 'parser-ts/Stream';
import { ParseResult } from 'parser-ts/ParseResult';

const identifier = many1(letter);

export const variable: Parser<Char, LCVariable> = pipe(
  identifier,
  map(LCVariable)
);

export const abstraction: Parser<Char, LCAbstraction> = pipe(
  string('\\'),
  chain(constant(spaces)),
  bind('identifier', constant(identifier)),
  chainFirst(constant(spaces)),
  chainFirst(constant(string('->'))),
  chainFirst(constant(spaces)),
  bind('body', constant(parse)),
  chainFirst(constant(spaces)),
  map(({ identifier, body }) => LCAbstraction(identifier, body))
);

export const grouping: Parser<Char, LCGrouping> = pipe(
  parse,
  surroundedBy(spaces),
  between(char('('), char(')')),
  map(LCGrouping)
);

export const application: Parser<Char, LCApplication> = pipe(
  either<Char, LCTerm>(
    grouping,
    constant(variable)
  ),
  bindTo('term'),
  chainFirst(constant(spaces)),
  bind('argument', constant(parse)),
  map(({ term, argument }) => LCApplication(term, argument))
);

export function parse(i: Stream<Char>): ParseResult<Char, LCTerm> {
  return either(
    grouping,
    constant(
      either(
        abstraction,
        constant(
          either<Char, LCTerm>(
            application,
            constant(variable)
          )
        )
      )
    )
  )(i);
}