import "server-only";

/**
 * Typed, no-op Supabase admin stub
 * Build- and type-safe only.
 */

type FakeResult = Promise<{ data: any[]; error: null }>;

type FakeQuery = {
  select: (...args: any[]) => FakeQuery;
  eq: (...args: any[]) => FakeQuery;
  order: (...args: any[]) => FakeResult;
  maybeSingle: () => Promise<{ data: null; error: null }>;
};

type FakeSupabase = {
  from: (table: string) => FakeQuery;
};

export function supabaseAdmin(): FakeSupabase {
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
          return Promise.resolve({ data: [], error: null });
        },
        async maybeSingle() {
          return { data: null, error: null };
        },
      };
    },
  };
}
