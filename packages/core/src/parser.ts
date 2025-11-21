import { SyncRule, Query, Invocation } from './engine/types';

export class SyncParser {
  private input: string;
  private pos: number;

  constructor(input: string) {
    this.input = input;
    this.pos = 0;
  }

  parse(): SyncRule[] {
    const rules: SyncRule[] = [];
    while (this.peek() !== '') {
      if (this.peek().startsWith('sync ')) {
        rules.push(this.parseSync());
      } else {
        this.skipWhitespace();
        if (this.peek() === '') break;
        throw new Error(`Unexpected token: ${this.peek()}`);
      }
    }
    return rules;
  }

  private parseSync(): SyncRule {
    this.expect('sync ');
    const name = this.readWord();
    this.skipWhitespace();

    const rule: SyncRule = { name, when: [], then: [] };

    while (this.peek() !== '' && !this.peek().startsWith('sync ')) {
      if (this.peek().startsWith('when ')) {
        rule.when = this.parseWhen();
      } else if (this.peek().startsWith('where ')) {
        rule.where = this.parseWhere();
      } else if (this.peek().startsWith('then ')) {
        rule.then = this.parseThen();
      } else {
        this.skipWhitespace();
        if (this.peek() === '') break;
        throw new Error(`Unexpected block: ${this.peek()}`);
      }
    }

    return rule;
  }

  private parseWhen(): any[] {
    this.expect('when {');
    const patterns: any[] = [];
    while (!this.peek().startsWith('}')) {
      patterns.push(this.parsePattern());
      this.skipWhitespace();
    }
    this.expect('}');
    return patterns;
  }

  private parsePattern(): any {
    const concept = this.readWord();
    this.expect('/');
    const action = this.readWord();
    this.expect(': {');
    const input = this.parseObject();
    this.expect('} => {');
    const output = this.parseObject();
    this.expect('}');
    return { concept, action, input, output };
  }

  private parseWhere(): Query {
    this.expect('where {');
    let query: Query = {};
    while (!this.peek().startsWith('}')) {
      if (this.peek().startsWith('bind(')) {
        // For simplicity, skip bind for now
        this.skipUntil(')');
        this.skipWhitespace();
      } else if (this.peek().startsWith('filter(')) {
        // For simplicity, skip filter
        this.skipUntil(')');
        this.skipWhitespace();
      } else {
        // Assume concept query
        const concept = this.readWord();
        this.expect(': {');
        const bindings = this.parseObject();
        this.expect('}');
        query = { ...query, [concept]: bindings };
      }
      this.skipWhitespace();
    }
    this.expect('}');
    return query;
  }

  private parseThen(): Invocation[] {
    this.expect('then {');
    const invocations: Invocation[] = [];
    while (!this.peek().startsWith('}')) {
      invocations.push(this.parseInvocation());
      this.skipWhitespace();
    }
    this.expect('}');
    return invocations;
  }

  private parseInvocation(): Invocation {
    const concept = this.readWord();
    this.expect('/');
    const action = this.readWord();
    this.expect(': {');
    const input = this.parseObject();
    this.expect('}');
    return { concept, action, input };
  }

  private parseObject(): any {
    // Simple object parser, assume key: value, separated by ,
    const obj: any = {};
    while (!this.peek().startsWith('}')) {
      const key = this.readWord();
      this.expect(':');
      this.skipWhitespace();
      const value = this.readValue();
      obj[key] = value;
      if (this.peek() === ',') {
        this.pos++;
        this.skipWhitespace();
      } else if (this.peek() === '}') {
        break;
      }
    }
    return obj;
  }

  private readValue(): any {
    const start = this.pos;
    if (this.peek().startsWith('"')) {
      this.pos++;
      while (this.input[this.pos] !== '"') this.pos++;
      this.pos++;
      return this.input.slice(start, this.pos);
    } else if (this.peek().startsWith('?')) {
      return this.readWord();
    } else if (/^\w+\(\)/.test(this.peek())) {
      return this.readWord() + '()';
    } else {
      return this.readWord();
    }
  }

  private readWord(): string {
    this.skipWhitespace();
    const start = this.pos;
    while (this.pos < this.input.length && /\w/.test(this.input[this.pos])) {
      this.pos++;
    }
    return this.input.slice(start, this.pos);
  }

  private expect(str: string): void {
    this.skipWhitespace();
    if (this.input.slice(this.pos, this.pos + str.length) !== str) {
      throw new Error(`Expected '${str}', got '${this.input.slice(this.pos, this.pos + 10)}...'`);
    }
    this.pos += str.length;
  }

  private peek(): string {
    this.skipWhitespace();
    return this.input.slice(this.pos);
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  private skipUntil(char: string): void {
    while (this.pos < this.input.length && this.input[this.pos] !== char) {
      this.pos++;
    }
    if (this.input[this.pos] === char) this.pos++;
  }
}

export function parseSyncDSL(dsl: string): SyncRule[] {
  const parser = new SyncParser(dsl);
  return parser.parse();
}