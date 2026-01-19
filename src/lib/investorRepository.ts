export interface InvestorRepository {
  getByEmail(email: string): Promise<any | null>;
  save(inv: any): Promise<void>;
  list(): Promise<any[]>;
  audit(event: any): Promise<void>;
}
