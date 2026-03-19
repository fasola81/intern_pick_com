// State Minimum Wage Data (as of 2024-2025)
// States without their own minimum wage follow the federal rate of $7.25/hr
// Source: U.S. Department of Labor - https://www.dol.gov/agencies/whd/minimum-wage/state

export interface StateMinimumWage {
  state: string
  abbr: string
  rate: number
  note?: string
}

export const FEDERAL_MINIMUM_WAGE = 7.25

export const STATE_MINIMUM_WAGES: StateMinimumWage[] = [
  { state: 'Alabama', abbr: 'AL', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'Alaska', abbr: 'AK', rate: 11.73 },
  { state: 'Arizona', abbr: 'AZ', rate: 14.35 },
  { state: 'Arkansas', abbr: 'AR', rate: 11.00 },
  { state: 'California', abbr: 'CA', rate: 16.50 },
  { state: 'Colorado', abbr: 'CO', rate: 14.81 },
  { state: 'Connecticut', abbr: 'CT', rate: 16.35 },
  { state: 'Delaware', abbr: 'DE', rate: 13.25 },
  { state: 'District of Columbia', abbr: 'DC', rate: 17.50 },
  { state: 'Florida', abbr: 'FL', rate: 13.00 },
  { state: 'Georgia', abbr: 'GA', rate: 7.25, note: 'State rate is $5.15 — federal rate applies' },
  { state: 'Hawaii', abbr: 'HI', rate: 14.00 },
  { state: 'Idaho', abbr: 'ID', rate: 7.25 },
  { state: 'Illinois', abbr: 'IL', rate: 14.00 },
  { state: 'Indiana', abbr: 'IN', rate: 7.25 },
  { state: 'Iowa', abbr: 'IA', rate: 7.25 },
  { state: 'Kansas', abbr: 'KS', rate: 7.25 },
  { state: 'Kentucky', abbr: 'KY', rate: 7.25 },
  { state: 'Louisiana', abbr: 'LA', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'Maine', abbr: 'ME', rate: 14.65 },
  { state: 'Maryland', abbr: 'MD', rate: 15.00 },
  { state: 'Massachusetts', abbr: 'MA', rate: 15.00 },
  { state: 'Michigan', abbr: 'MI', rate: 10.56 },
  { state: 'Minnesota', abbr: 'MN', rate: 11.13 },
  { state: 'Mississippi', abbr: 'MS', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'Missouri', abbr: 'MO', rate: 13.75 },
  { state: 'Montana', abbr: 'MT', rate: 10.55 },
  { state: 'Nebraska', abbr: 'NE', rate: 13.50 },
  { state: 'Nevada', abbr: 'NV', rate: 12.00 },
  { state: 'New Hampshire', abbr: 'NH', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'New Jersey', abbr: 'NJ', rate: 15.49 },
  { state: 'New Mexico', abbr: 'NM', rate: 12.00 },
  { state: 'New York', abbr: 'NY', rate: 15.50 },
  { state: 'North Carolina', abbr: 'NC', rate: 7.25 },
  { state: 'North Dakota', abbr: 'ND', rate: 7.25 },
  { state: 'Ohio', abbr: 'OH', rate: 10.65 },
  { state: 'Oklahoma', abbr: 'OK', rate: 7.25 },
  { state: 'Oregon', abbr: 'OR', rate: 14.70 },
  { state: 'Pennsylvania', abbr: 'PA', rate: 7.25 },
  { state: 'Rhode Island', abbr: 'RI', rate: 14.00 },
  { state: 'South Carolina', abbr: 'SC', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'South Dakota', abbr: 'SD', rate: 11.20 },
  { state: 'Tennessee', abbr: 'TN', rate: 7.25, note: 'No state minimum — federal rate applies' },
  { state: 'Texas', abbr: 'TX', rate: 7.25 },
  { state: 'Utah', abbr: 'UT', rate: 7.25 },
  { state: 'Vermont', abbr: 'VT', rate: 14.01 },
  { state: 'Virginia', abbr: 'VA', rate: 12.41 },
  { state: 'Washington', abbr: 'WA', rate: 16.66 },
  { state: 'West Virginia', abbr: 'WV', rate: 8.75 },
  { state: 'Wisconsin', abbr: 'WI', rate: 7.25 },
  { state: 'Wyoming', abbr: 'WY', rate: 7.25, note: 'State rate is $5.15 — federal rate applies' },
]

export function getMinimumWageByAbbr(abbr: string): StateMinimumWage | undefined {
  return STATE_MINIMUM_WAGES.find(s => s.abbr === abbr)
}

export function getMinimumWageByState(stateName: string): StateMinimumWage | undefined {
  return STATE_MINIMUM_WAGES.find(s => s.state.toLowerCase() === stateName.toLowerCase())
}
