
'use server';
/**
 * @fileOverview Genkit flow for converting XML content to CSV format using AI.
 * - convertXmlToCsv - Function that takes XML text and returns CSV text if tabular data is found.
 * - XmlToCsvInput - Input type for the convertXmlToCsv function.
 * - XmlToCsvOutput - Output type for the convertXmlToCsv function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const XmlToCsvInputSchema = z.object({
  xmlText: z.string()
    .min(10, { message: "XML content must be at least 10 characters."})
    .max(100000, { message: "XML content is too long (max 100KB)."}) // Limit input size
    .describe('The XML content as a string.'),
  originalFileName: z.string().optional().describe('The original file name, used for deriving output CSV/Excel file names.'),
});
export type XmlToCsvInput = z.infer<typeof XmlToCsvInputSchema>;

const XmlToCsvOutputSchema = z.object({
  csvText: z.string().describe('The extracted data in CSV format, or a specific message like "NO_TABULAR_DATA_FOUND" or "INVALID_XML_INPUT".'),
  success: z.boolean().describe('Whether CSV data (not an error/status message) was successfully generated.'),
  message: z.string().optional().describe('Optional message, e.g., if no table found or for specific errors from AI.'),
  originalFileName: z.string().optional(),
});
export type XmlToCsvOutput = z.infer<typeof XmlToCsvOutputSchema>;

const NO_TABULAR_DATA_MESSAGE = "NO_TABULAR_DATA_FOUND";
const INVALID_XML_MESSAGE = "INVALID_XML_INPUT";

const xmlToCsvGenPrompt = ai.definePrompt({
  name: 'xmlToCsvGenPrompt',
  input: { schema: XmlToCsvInputSchema.pick({ xmlText: true }) }, // Only xmlText needed for the prompt itself
  output: { schema: z.object({ extractedCsvOrMessage: z.string() }) }, // AI will output a single string
  prompt: `You are an expert data extraction assistant specialized in converting XML data to CSV.
The user has provided XML content. Your task is to:
1. Analyze the XML to identify the primary, most significant tabular data structure. This usually means a repeating set of elements with similar child elements that can represent rows and columns.
2. Convert this tabular data into a valid CSV (Comma Separated Values) string.
   - The first row of the CSV should be headers, derived from the XML tags of the chosen tabular structure if appropriate.
   - Ensure correct CSV formatting: commas as delimiters, newlines for rows.
   - Handle commas within data fields by enclosing the field in double quotes (e.g., "Doe, John").
   - Handle double quotes within data fields by escaping them with another double quote (e.g., "Said ""Hello""").
3. If no clear tabular data can be reasonably extracted, or if the XML structure is too complex for a straightforward tabular representation (e.g., deeply nested, non-repeating structures not suitable for a flat table), respond with ONLY the exact string: "${NO_TABULAR_DATA_MESSAGE}".
4. If the input XML appears to be malformed or unparsable as XML, respond with ONLY the exact string: "${INVALID_XML_MESSAGE}".
5. Otherwise, your entire output should be ONLY the CSV string. Do NOT include any other text, explanations, or markdown formatting like \`\`\`csv ... \`\`\` or any introductory sentences.

XML Content to process:
{{{xmlText}}}
`,
  config: {
    temperature: 0.1, // Lower temperature for more deterministic output in data extraction
  }
});

const xmlToCsvFlow = ai.defineFlow(
  {
    name: 'xmlToCsvFlow',
    inputSchema: XmlToCsvInputSchema,
    outputSchema: XmlToCsvOutputSchema,
  },
  async (input) => {
    const { output } = await xmlToCsvGenPrompt({ xmlText: input.xmlText });

    if (!output || !output.extractedCsvOrMessage) {
      return {
        csvText: 'AI_PROCESSING_ERROR',
        success: false,
        message: 'AI model did not return any output.',
        originalFileName: input.originalFileName,
      };
    }

    const resultText = output.extractedCsvOrMessage.trim();

    if (resultText === NO_TABULAR_DATA_MESSAGE) {
      return {
        csvText: resultText,
        success: false,
        message: 'No clear tabular data was found in the XML by the AI.',
        originalFileName: input.originalFileName,
      };
    }

    if (resultText === INVALID_XML_MESSAGE) {
      return {
        csvText: resultText,
        success: false,
        message: 'The AI determined the XML input was invalid or malformed.',
        originalFileName: input.originalFileName,
      };
    }
    
    // Basic check if it looks like CSV (has commas or newlines)
    // This is not a foolproof CSV validation, but a heuristic.
    const looksLikeCsv = resultText.includes(',') || resultText.includes('\n');
    if (!looksLikeCsv && resultText.length < 200) { // If it's short and doesn't look like CSV, it might be an AI explanation
         return {
            csvText: 'AI_EXPLANATION_INSTEAD_OF_CSV',
            success: false,
            message: `AI might have returned an explanation instead of CSV: "${resultText.substring(0,100)}..."`,
            originalFileName: input.originalFileName,
        };
    }


    return {
      csvText: resultText,
      success: true,
      message: 'CSV data extracted successfully by AI.',
      originalFileName: input.originalFileName,
    };
  }
);

export async function convertXmlToCsv(input: XmlToCsvInput): Promise<XmlToCsvOutput> {
  return xmlToCsvFlow(input);
}
