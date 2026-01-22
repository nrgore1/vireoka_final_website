import "server-only";

/**
 * Typed, no-op Supabase admin stub
 * Satisfies build + TypeScript only.
 */

type FakeQuery = {
  select: (...args: any[]) => FakeQuery;
  eq: (...args: any[]) => FakeQuery;
  order: (...args: any[]) => FakeQuery;
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
          return this;
        },
        async maybeSingle() {
          return { data: null, error: null };
        },
      };
    },
  };
}
