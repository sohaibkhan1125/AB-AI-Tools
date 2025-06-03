
'use server';
/**
 * @fileOverview Genkit flow for converting CSV text to JSON text.
 * - convertCsvToJson - Function that takes CSV text and returns JSON text.
 * - CsvToJsonInput - Input type for the convertCsvToJson function.
 * - CsvToJsonOutput - Output type for the convertCsvToJson function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CsvToJsonInputSchema = z.object({
  csvText: z.string().describe('The CSV content as a string.'),
});
export type CsvToJsonInput = z.infer<typeof CsvToJsonInputSchema>;

const CsvToJsonOutputSchema = z.object({
  jsonText: z.string().describe('The converted JSON content as a string.'),
});
export type CsvToJsonOutput = z.infer<typeof CsvToJsonOutputSchema>;

/**
 * Converts CSV text to a JSON string.
 * Note: This is a basic parser and may not handle all CSV complexities
 * (e.g., escaped quotes within fields, custom delimiters).
 * @param csvText The CSV data as a string.
 * @returns The JSON data as a string.
 */
function robustCsvTextToJson(csvText: string): string {
    const lines = csvText.trim().split(/\r?\n/); // Handles \n and \r\n line endings
    if (lines.length === 0) {
      return JSON.stringify([], null, 2);
    }

    // Basic CSV value parser (handles simple quotes, but not advanced cases like escaped quotes within quotes)
    const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let currentField = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"' && (i === 0 || line[i-1] !== '\\')) { // Handle non-escaped quotes
                // If next char is also a quote (escaped quote), consume it and continue
                if (inQuotes && i + 1 < line.length && line[i+1] === '"') {
                    currentField += '"';
                    i++; // Skip next quote
                    continue;
                }
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(currentField.trim());
                currentField = '';
            } else {
                currentField += char;
            }
        }
        result.push(currentField.trim()); // Add the last field
        return result.map(field => field.replace(/^"|"$/g, '').replace(/""/g, '"')); // Remove surrounding quotes and unescape double quotes
    };
    
    const headers = parseCsvLine(lines[0]);
    const jsonArray: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Skip empty lines
        const values = parseCsvLine(lines[i]);
        
        if (values.length === headers.length) {
            const entry: Record<string, string> = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j];
            }
            jsonArray.push(entry);
        } else {
            console.warn(`Skipping line ${i + 1} due to column mismatch: expected ${headers.length}, got ${values.length}. Line: '${lines[i]}'`);
        }
    }
    return JSON.stringify(jsonArray, null, 2); // Pretty print JSON
}

const csvToJsonFlow = ai.defineFlow(
  {
    name: 'csvToJsonFlow',
    inputSchema: CsvToJsonInputSchema,
    outputSchema: CsvToJsonOutputSchema,
  },
  async (input) => {
    try {
      const jsonResult = robustCsvTextToJson(input.csvText);
      return { jsonText: jsonResult };
    } catch (e: any) {
      console.error("CSV to JSON conversion error in flow:", e);
      throw new Error(`Conversion failed: ${e.message || 'Unknown error during CSV to JSON conversion.'}`);
    }
  }
);

export async function convertCsvToJson(input: CsvToJsonInput): Promise<CsvToJsonOutput> {
  return csvToJsonFlow(input);
}
