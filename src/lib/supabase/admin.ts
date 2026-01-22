import "server-only";

/**
 * Typed, no-op Supabase admin stub
 * Accurately models Supabase chaining behavior.
 */

type FakeResult = Promise<{ data: any[]; error: null }>;

type FakeTerminal = {
  then: FakeResult["then"];
  limit: (...args: any[]) => FakeResult;
};

type FakeQuery = {
  select: (...args: any[]) => FakeQuery;
  eq: (...args: any[]) => FakeQuery;
  order: (...args: any[]) => FakeTerminal;
  upsert: (...args: any[]) => Promise<{ error: null }>;
  update: (...args: any[]) => FakeQuery;
  insert: (...args: any[]) => Promise<{ error: null }>;
  maybeSingle: () => Promise<{ data: null; error: null }>;
};

type FakeSupabase = {
  from: (table: string) => FakeQuery;
};

export function supabaseAdmin(): FakeSupabase {
  const terminal = (): FakeTerminal => {
    const result = Promise.resolve({ data: [], error: null });
    return {
      then: result.then.bind(result),
      limit() {
        return result;
      },
    };
  };

  return {
    from() {
      return {
        select() {
          return this;
        },
        eq() {
          return this;
        },
        order() {
          return terminal();
        },
        upsert() {
          return Promise.resolve({ error: null });
        },
        update() {
          return this;
        },
        insert() {
          return Promise.resolve({ error: null });
        },
        async maybeSingle() {
          return { data: null, error: null };
        },
      };
    },
  };
}
